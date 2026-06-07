package AssetTrack.repository;

import AssetTrack.model.SolicitacaoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface SolicitacaoEstoqueRepository extends JpaRepository<SolicitacaoEstoque, UUID> {
    List<SolicitacaoEstoque> findAllByOrderByDataSolicitacaoDesc();
    List<SolicitacaoEstoque> findByUsuarioSolicitante_IdOrderByDataSolicitacaoDesc(UUID idUsuario);
}