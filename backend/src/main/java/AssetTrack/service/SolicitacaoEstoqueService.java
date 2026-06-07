package AssetTrack.service;

import AssetTrack.dto.SolicitacaoEstoqueRequestDTO;
import AssetTrack.dto.SolicitacaoEstoqueResponseDTO;
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
public class SolicitacaoEstoqueService {

    @Autowired private SolicitacaoEstoqueRepository repository;
    @Autowired private ItemEstoqueRepository        itemRepository;
    @Autowired private AvaliacaoRepository          avaliacaoRepository;

    private static final Set<String> STATUS_VALIDOS =
            Set.of("ABERTA", "APROVADA", "RECUSADA", "EM_ANDAMENTO", "CONCLUIDA");

    public List<SolicitacaoEstoqueResponseDTO> listarTodas() {
        return repository.findAllByOrderByDataSolicitacaoDesc().stream()
                .map(this::toDTO)
                .toList();
    }

    public List<SolicitacaoEstoqueResponseDTO> listarPorUsuario(UUID idUsuario) {
        return repository.findByUsuarioSolicitante_IdOrderByDataSolicitacaoDesc(idUsuario).stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public SolicitacaoEstoqueResponseDTO abrir(SolicitacaoEstoqueRequestDTO data, Usuario solicitante) {
        ItemEstoque item = itemRepository.findById(data.idItem())
                .orElseThrow(() -> new IllegalArgumentException("Item não encontrado."));

        SolicitacaoEstoque s = new SolicitacaoEstoque();
        s.setItem(item);
        s.setQuantidadeSolicitada(data.quantidadeSolicitada() != null ? data.quantidadeSolicitada() : 1);
        s.setObservacao(data.observacao());
        s.setStatusPedido("ABERTA");
        s.setUsuarioSolicitante(solicitante);
        repository.save(s);
        return toDTO(s);
    }

    @Transactional
    public SolicitacaoEstoqueResponseDTO atualizarStatus(UUID id, String novoStatus) {
        SolicitacaoEstoque s = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada."));

        String status = novoStatus == null ? "" : novoStatus.toUpperCase();
        if (!STATUS_VALIDOS.contains(status))
            throw new IllegalArgumentException("Status inválido: " + novoStatus);

        s.setStatusPedido(status);
        if (status.equals("CONCLUIDA") || status.equals("RECUSADA")) {
            s.setDataConclusao(LocalDateTime.now());
        }
        repository.save(s);
        return toDTO(s);
    }

    private SolicitacaoEstoqueResponseDTO toDTO(SolicitacaoEstoque s) {
        Avaliacao a = avaliacaoRepository
                .findBySolicitacaoEstoque_IdSolicitacaoEstoque(s.getIdSolicitacaoEstoque());
        return new SolicitacaoEstoqueResponseDTO(s, a);
    }
}