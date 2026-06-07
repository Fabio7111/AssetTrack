package AssetTrack.service;

import AssetTrack.dto.*;
import AssetTrack.model.*;
import AssetTrack.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ManutencaoService {

    @Autowired private SolicitacaoManutencaoRepository solicitacaoRepository;
    @Autowired private EquipamentoRepository equipamentoRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private ManutencaoRepository manutencaoRepository;

    @Transactional
    public SolicitacaoResponseDTO abrirSolicitacao(SolicitacaoRequestDTO data) {
        Equipamento equipamento = equipamentoRepository.findById(data.idEquipamento())
                .orElseThrow(() -> new IllegalArgumentException("Equipamento não encontrado."));

        Usuario solicitante = usuarioRepository.findById(data.idUsuarioSolicitante())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        SolicitacaoManutencao solicitacao = new SolicitacaoManutencao();
        solicitacao.setEquipamento(equipamento);
        solicitacao.setUsuarioSolicitante(solicitante);
        solicitacao.setDescricaoProblema(data.descricaoProblema());
        solicitacao.setStatusSolicitacao("PENDENTE");
        solicitacao.setDataAbertura(LocalDateTime.now());

        equipamento.setStatusAtual("EM MANUTENCAO");
        equipamentoRepository.save(equipamento);

        solicitacaoRepository.save(solicitacao);
        return new SolicitacaoResponseDTO(solicitacao);
    }

    @Transactional
    public SolicitacaoResponseDTO atualizarStatus(UUID idSolicitacao, String novoStatus) {
        SolicitacaoManutencao solicitacao = solicitacaoRepository.findById(idSolicitacao)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada."));

        solicitacao.setStatusSolicitacao(novoStatus.toUpperCase());

        if (novoStatus.equalsIgnoreCase("CONCLUIDO")) {
            Equipamento eq = solicitacao.getEquipamento();
            eq.setStatusAtual("ATIVO");
            equipamentoRepository.save(eq);
        }

        solicitacaoRepository.save(solicitacao);
        return new SolicitacaoResponseDTO(solicitacao);
    }

    @Transactional
    public void registrarManutencaoDireta(ManutencaoRequestDTO data) {
        Equipamento equipamento = equipamentoRepository.findById(data.idEquipamento())
                .orElseThrow(() -> new IllegalArgumentException("Equipamento não encontrado."));

        Usuario tecnico = usuarioRepository.findById(data.idTecnico())
                .orElseThrow(() -> new IllegalArgumentException("Técnico não encontrado."));

        Manutencao manutencao = new Manutencao();
        manutencao.setEquipamento(equipamento);
        manutencao.setTecnico(tecnico);
        manutencao.setTipoManutencao(data.tipoManutencao());
        manutencao.setDataInicio(data.dataInicio());
        manutencao.setDataConclusao(data.dataConclusao());
        manutencao.setDescricaoServico(data.descricaoServico());
        manutencao.setCustoManutencao(data.custoManutencao());

        if (data.dataConclusao() != null) {
            equipamento.setStatusAtual("ATIVO");
        } else {
            equipamento.setStatusAtual("EM MANUTENCAO");
        }
        equipamentoRepository.save(equipamento);

        manutencaoRepository.save(manutencao);
    }

    @Transactional
    public void atualizarManutencao(UUID id, ManutencaoRequestDTO data) {
        Manutencao manutencao = manutencaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Manutenção não encontrada."));

        Equipamento equipamento = equipamentoRepository.findById(data.idEquipamento()).orElseThrow();
        Usuario tecnico = usuarioRepository.findById(data.idTecnico()).orElseThrow();

        manutencao.setEquipamento(equipamento);
        manutencao.setTecnico(tecnico);
        manutencao.setTipoManutencao(data.tipoManutencao());
        manutencao.setDataInicio(data.dataInicio());
        manutencao.setDataConclusao(data.dataConclusao());
        manutencao.setDescricaoServico(data.descricaoServico());
        manutencao.setCustoManutencao(data.custoManutencao());

        if (!"CANCELADA".equalsIgnoreCase(manutencao.getStatus())) {
            if (data.dataConclusao() != null) {
                equipamento.setStatusAtual("ATIVO");
            } else {
                equipamento.setStatusAtual("EM MANUTENCAO");
            }
            equipamentoRepository.save(equipamento);
        }

        manutencaoRepository.save(manutencao);
    }

    @Transactional
    public void deletarManutencao(UUID id) {
        Manutencao manutencao = manutencaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Manutenção não encontrada."));

        manutencao.setStatus("CANCELADA");

        Equipamento eq = manutencao.getEquipamento();
        if (eq != null && "EM MANUTENCAO".equalsIgnoreCase(eq.getStatusAtual())) {
            eq.setStatusAtual("ATIVO");
            equipamentoRepository.save(eq);
        }

        manutencaoRepository.save(manutencao);
    }

    public List<ManutencaoResponseDTO> listarTodasManutencoes() {
        return manutencaoRepository.findAll().stream()
                .map(ManutencaoResponseDTO::new)
                .collect(Collectors.toList());
    }
}