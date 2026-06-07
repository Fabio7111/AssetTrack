package AssetTrack.service;

import AssetTrack.dto.*;
import AssetTrack.model.*;
import AssetTrack.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AuditoriaService {

    @Autowired private AuditoriaRepository           auditoriaRepository;
    @Autowired private AuditoriaItemRepository        auditoriaItemRepository;
    @Autowired private EquipamentoRepository          equipamentoRepository;
    @Autowired private ItemEstoqueRepository          itemRepository;
    @Autowired private SetorRepository                setorRepository;
    @Autowired private MovimentacaoEstoqueRepository  movimentacaoRepository;

    public List<AuditoriaResponseDTO> listarTodas() {
        return auditoriaRepository.findAll().stream()
                .sorted(Comparator.comparing(Auditoria::getDataInicio).reversed())
                .map(AuditoriaResponseDTO::new)
                .toList();
    }

    @Transactional
    public AuditoriaResponseDTO registrar(AuditoriaRequestDTO data, Usuario auditor) {
        String tipo = (data.tipoAuditoria() == null ? "" : data.tipoAuditoria().toUpperCase());
        if (!tipo.equals("EQUIPAMENTO") && !tipo.equals("ESTOQUE"))
            throw new IllegalArgumentException("Tipo de auditoria inválido.");

        Auditoria a = new Auditoria();
        a.setTipoAuditoria(tipo);
        a.setDescricao(data.descricao());
        a.setStatusAuditoria("PENDENTE");
        a.setAuditor(auditor);

        if (data.idSetorAuditado() != null) {
            Setor s = setorRepository.findById(data.idSetorAuditado())
                    .orElseThrow(() -> new IllegalArgumentException("Setor não encontrado."));
            a.setSetorAuditado(s);
        }

        auditoriaRepository.save(a);
        return new AuditoriaResponseDTO(a);
    }

    @Transactional
    public List<AuditoriaItemResponseDTO> iniciar(UUID idAuditoria) {
        Auditoria a = auditoriaRepository.findById(idAuditoria)
                .orElseThrow(() -> new IllegalArgumentException("Auditoria não encontrada."));

        if (a.getStatusAuditoria().equals("PENDENTE")) {
            a.setStatusAuditoria("EM_ANDAMENTO");
            auditoriaRepository.save(a);
        }

        return carregarPlanilha(a);
    }

    public List<AuditoriaItemResponseDTO> carregarPlanilha(Auditoria a) {
        List<AuditoriaItemResponseDTO> linhas = new ArrayList<>();

        if (a.getTipoAuditoria().equals("EQUIPAMENTO")) {
            List<Equipamento> equipamentos = equipamentoRepository.findAll().stream()
                    .filter(eq -> "ATIVO".equalsIgnoreCase(eq.getStatusAtual()))
                    .toList();

            if (a.getSetorAuditado() != null) {
                UUID idSetor = a.getSetorAuditado().getIdSetor();
                equipamentos = equipamentos.stream()
                        .filter(eq -> eq.getSetor() != null
                                && idSetor.equals(eq.getSetor().getIdSetor()))
                        .toList();
            }

            for (Equipamento eq : equipamentos) {
                linhas.add(new AuditoriaItemResponseDTO(
                        eq.getIdEquipamento(),
                        "EQUIPAMENTO",
                        eq.getNomeEquipamento(),
                        eq.getSetor() != null ? eq.getSetor().getNomeSetor() : "—",
                        null,
                        eq.getNumeroSerie(),
                        eq.getStatusAtual()
                ));
            }
        } else {
            List<ItemEstoque> itens = itemRepository.findAll().stream()
                    .filter(it -> !"ESGOTADO".equalsIgnoreCase(it.getStatus()))
                    .toList();
            for (ItemEstoque it : itens) {
                linhas.add(new AuditoriaItemResponseDTO(
                        it.getIdItem(),
                        "ESTOQUE",
                        it.getNomeItem(),
                        it.getCategoria(),
                        it.getQuantidadeDisponivel(),
                        null,
                        it.getStatus()
                ));
            }
        }
        return linhas;
    }

    public List<AuditoriaItemResponseDTO> planilhaDe(UUID idAuditoria) {
        Auditoria a = auditoriaRepository.findById(idAuditoria)
                .orElseThrow(() -> new IllegalArgumentException("Auditoria não encontrada."));
        return carregarPlanilha(a);
    }

    public List<AuditoriaItemSalvoDTO> itensSalvos(UUID idAuditoria) {
        return auditoriaItemRepository.findByAuditoria_IdAuditoria(idAuditoria).stream()
                .map(AuditoriaItemSalvoDTO::de)
                .toList();
    }

    @Transactional
    public void enviar(UUID idAuditoria, List<AuditoriaItemRequestDTO> itens, Usuario auditor) {
        Auditoria a = auditoriaRepository.findById(idAuditoria)
                .orElseThrow(() -> new IllegalArgumentException("Auditoria não encontrada."));

        for (AuditoriaItemRequestDTO linha : itens) {
            AuditoriaItem item = new AuditoriaItem();
            item.setAuditoria(a);
            item.setObservacao(linha.observacao());
            item.setQuantidadeContada(linha.quantidadeContada());

            int qtd = linha.quantidadeContada() != null ? linha.quantidadeContada() : 0;

            if (a.getTipoAuditoria().equals("EQUIPAMENTO") && linha.idEquipamento() != null) {
                Equipamento eq = equipamentoRepository.findById(linha.idEquipamento())
                        .orElseThrow(() -> new IllegalArgumentException("Equipamento não encontrado."));

                item.setEquipamento(eq);
                item.setNumeroSerieContado(linha.numeroSerieContado());
                item.setFoiEncontrado(qtd > 0);

                if (linha.numeroSerieContado() != null && !linha.numeroSerieContado().isBlank()) {
                    eq.setNumeroSerie(linha.numeroSerieContado());
                }
                if (qtd <= 0) {
                    eq.setStatusAtual("INATIVO");
                }
                equipamentoRepository.save(eq);

            } else if (a.getTipoAuditoria().equals("ESTOQUE") && linha.idItemEstoque() != null) {
                ItemEstoque it = itemRepository.findById(linha.idItemEstoque())
                        .orElseThrow(() -> new IllegalArgumentException("Item não encontrado."));

                item.setItemEstoque(it);
                item.setFoiEncontrado(qtd > 0);

                int qtdAtual = it.getQuantidadeDisponivel() != null ? it.getQuantidadeDisponivel() : 0;
                int diferenca = qtd - qtdAtual;

                if (diferenca != 0) {
                    MovimentacaoEstoque mov = new MovimentacaoEstoque();
                    mov.setItem(it);
                    mov.setTipo(diferenca > 0 ? "ENTRADA" : "SAIDA");
                    mov.setQuantidade(Math.abs(diferenca));
                    mov.setUsuario(auditor);
                    mov.setObservacao("Ajuste por auditoria de estoque");
                    movimentacaoRepository.save(mov);

                    it.setQuantidadeDisponivel(qtd);
                    it.setStatus(resolverStatus(qtd));
                    itemRepository.save(it);
                }
            }

            auditoriaItemRepository.save(item);
        }

        a.setStatusAuditoria("CONCLUIDA");
        a.setDataConclusao(LocalDateTime.now());
        auditoriaRepository.save(a);
    }

    private String resolverStatus(int qtd) {
        if (qtd == 0)  return "ESGOTADO";
        if (qtd <= 3)  return "BAIXO_ESTOQUE";
        return "DISPONIVEL";
    }
}