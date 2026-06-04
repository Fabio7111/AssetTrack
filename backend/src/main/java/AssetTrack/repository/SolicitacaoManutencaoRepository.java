package AssetTrack.repository;

import AssetTrack.model.SolicitacaoManutencao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface SolicitacaoManutencaoRepository extends JpaRepository<SolicitacaoManutencao, UUID> {

    @Query("SELECT COUNT(s) FROM SolicitacaoManutencao s WHERE s.statusSolicitacao = 'PENDENTE'")
    Long contarSolicitacoesPendentes();
}