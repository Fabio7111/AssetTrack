package AssetTrack.service;

import AssetTrack.dto.SolicitacaoManutencaoRequestDTO;
import AssetTrack.dto.SolicitacaoManutencaoResponseDTO;
import AssetTrack.model.*;
import AssetTrack.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class SolicitacaoManutencaoService {

    @Autowired private SolicitacaoManutencaoRepository repository;
    @Autowired private EquipamentoRepository           equipamentoRepository;
    @Autowired private AvaliacaoRepository             avaliacaoRepository;

    private static final Set<String> STATUS_VALIDOS =
            Set.of("ABERTA", "APROVADA", "RECUSADA", "EM_ANDAMENTO", "CONCLUIDA");

    public List<SolicitacaoManutencaoResponseDTO> listarTodas() {
        return repository.findAllByOrderByDataAberturaDesc().stream()
                .map(this::toDTO)
                .toList();
    }

    public List<SolicitacaoManutencaoResponseDTO> listarPorUsuario(UUID idUsuario) {
        return repository.findByUsuarioSolicitante_IdOrderByDataAberturaDesc(idUsuario).stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public SolicitacaoManutencaoResponseDTO abrir(SolicitacaoManutencaoRequestDTO data, Usuario solicitante) {
        Equipamento eq = equipamentoRepository.findById(data.idEquipamento())
                .orElseThrow(() -> new IllegalArgumentException("Equipamento não encontrado."));

        SolicitacaoManutencao s = new SolicitacaoManutencao();
        s.setDescricaoProblema(data.descricaoProblema());
        s.setStatusSolicitacao("ABERTA");
        s.setUsuarioSolicitante(solicitante);
        s.setEquipamento(eq);
        repository.save(s);
        return toDTO(s);
    }

    @Transactional
    public SolicitacaoManutencaoResponseDTO atualizarStatus(UUID id, String novoStatus) {
        SolicitacaoManutencao s = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada."));

        String status = novoStatus == null ? "" : novoStatus.toUpperCase();
        if (!STATUS_VALIDOS.contains(status))
            throw new IllegalArgumentException("Status inválido: " + novoStatus);

        s.setStatusSolicitacao(status);
        if (status.equals("CONCLUIDA") || status.equals("RECUSADA")) {
            s.setDataConclusao(LocalDateTime.now());
        }
        repository.save(s);
        return toDTO(s);
    }

    private SolicitacaoManutencaoResponseDTO toDTO(SolicitacaoManutencao s) {
        Avaliacao a = avaliacaoRepository
                .findBySolicitacaoManutencao_IdSolicitacaoManutencao(s.getIdSolicitacaoManutencao());
        return new SolicitacaoManutencaoResponseDTO(s, a);
    }
}