package AssetTrack.repository;

import AssetTrack.model.Descarte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface DescarteRepository extends JpaRepository<Descarte, UUID> {
}