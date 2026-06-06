package AssetTrack.repository;

import AssetTrack.model.ItemEstoque;
import AssetTrack.model.UnidadeEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface UnidadeEstoqueRepository extends JpaRepository<UnidadeEstoque, UUID> {
    List<UnidadeEstoque> findByItem(ItemEstoque item);
    List<UnidadeEstoque> findByItemOrderByPatrimonioAsc(ItemEstoque item);
}