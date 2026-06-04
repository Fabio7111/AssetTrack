package AssetTrack.repository;

import AssetTrack.model.AuditoriaItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuditoriaItemRepository extends JpaRepository<AuditoriaItem, UUID> {
    List<AuditoriaItem> findByAuditoria_IdAuditoria(UUID idAuditoria);
}