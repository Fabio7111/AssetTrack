package AssetTrack.service;

import AssetTrack.dto.MovimentacaoRequestDTO;
import AssetTrack.dto.MovimentacaoResponseDTO;
import AssetTrack.model.Equipamento;
import AssetTrack.model.Movimentacao;
import AssetTrack.model.Setor;
import AssetTrack.model.Usuario;
import AssetTrack.repository.EquipamentoRepository;
import AssetTrack.repository.MovimentacaoRepository;
import AssetTrack.repository.SetorRepository;
import AssetTrack.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MovimentacaoService {

    @Autowired private MovimentacaoRepository movimentacaoRepository;
    @Autowired private EquipamentoRepository  equipamentoRepository;
    @Autowired private SetorRepository        setorRepository;
    @Autowired private UsuarioRepository      usuarioRepository;

    public List<MovimentacaoResponseDTO> listarTodas() {
        return movimentacaoRepository.findAll().stream()
                .map(MovimentacaoResponseDTO::new)
                .collect(Collectors.toList());
    }

    public List<MovimentacaoResponseDTO> listarAtrasadas() {
        return movimentacaoRepository.findAll().stream()
                .filter(m -> "EM_USO".equalsIgnoreCase(m.getStatus())
                        && m.getDataConclusao() != null
                        && m.getDataConclusao().isBefore(LocalDateTime.now()))
                .map(MovimentacaoResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public MovimentacaoResponseDTO transferirEquipamento(MovimentacaoRequestDTO data) {
        Equipamento equipamento = equipamentoRepository.findById(data.idEquipamento())
                .orElseThrow(() -> new IllegalArgumentException("Equipamento não encontrado."));

        Setor setorDestino = setorRepository.findById(data.idSetorDestino())
                .orElseThrow(() -> new IllegalArgumentException("Setor de destino não encontrado."));

        Setor setorOrigem = (data.idSetorOrigem() != null)
                ? setorRepository.findById(data.idSetorOrigem()).orElse(null)
                : equipamento.getSetor();

        if (setorOrigem != null && setorDestino.getIdSetor().equals(setorOrigem.getIdSetor())) {
            throw new IllegalArgumentException("Setor de origem e destino não podem ser iguais.");
        }

        Usuario responsavel = (data.idUsuarioResponsavel() != null)
                ? usuarioRepository.findById(data.idUsuarioResponsavel()).orElse(null)
                : null;

        Movimentacao movimentacao = new Movimentacao();
        movimentacao.setEquipamento(equipamento);
        movimentacao.setSetorOrigem(setorOrigem);
        movimentacao.setSetorDestino(setorDestino);
        movimentacao.setResponsavel(responsavel);
        movimentacao.setDataMovimentacao(LocalDateTime.now());
        movimentacao.setStatus("AGENDADO");
        movimentacao.setDataInicio(data.dataInicio());
        movimentacao.setDataConclusao(data.dataConclusao());
        movimentacao.setObservacao(data.observacao());

        equipamento.setSetor(setorDestino);
        equipamentoRepository.save(equipamento);
        movimentacaoRepository.save(movimentacao);

        return new MovimentacaoResponseDTO(movimentacao);
    }

    @Transactional
    public void atualizarMovimentacao(UUID id, MovimentacaoRequestDTO data) {
        Movimentacao mov = movimentacaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Movimentação não encontrada."));

        if ("FINALIZADO".equals(data.status())) {
            mov.setStatus("FINALIZADO");
        } else {
            if (data.idSetorDestino() != null) {
                Setor destino = setorRepository.findById(data.idSetorDestino()).orElse(null);
                mov.setSetorDestino(destino);
                mov.getEquipamento().setSetor(destino);
            }
            mov.setStatus(data.status());
            mov.setDataInicio(data.dataInicio());
            mov.setDataConclusao(data.dataConclusao());
            mov.setObservacao(data.observacao());
        }

        movimentacaoRepository.save(mov);
    }

    @Transactional
    public void deletarMovimentacao(UUID id) {
        Movimentacao mov = movimentacaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Movimentação não encontrada."));

        mov.setStatus("CANCELADO");
        movimentacaoRepository.save(mov);
    }
}