package AssetTrack.repository;

import AssetTrack.model.Auditoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuditoriaRepository extends JpaRepository<Auditoria, UUID> {
    List<Auditoria> findBySetorAuditado_IdSetor(UUID idSetor);
}