package AssetTrack.repository;

import AssetTrack.model.SolicitacaoManutencao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface SolicitacaoManutencaoRepository extends JpaRepository<SolicitacaoManutencao, UUID> {
    List<SolicitacaoManutencao> findAllByOrderByDataAberturaDesc();
    List<SolicitacaoManutencao> findByUsuarioSolicitante_IdOrderByDataAberturaDesc(UUID idUsuario);

    long countByStatusSolicitacao(String statusSolicitacao);

    default Long contarSolicitacoesPendentes() {
        return countByStatusSolicitacao("PENDENTE");
    }
}