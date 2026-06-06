package AssetTrack.repository;

import AssetTrack.model.MovimentacaoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, UUID> {
    List<MovimentacaoEstoque> findAllByOrderByDataHoraDesc();
    List<MovimentacaoEstoque> findByItem_IdItemOrderByDataHoraDesc(UUID idItem);
}