package AssetTrack.repository;

import AssetTrack.model.Aquisicao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface AquisicaoRepository extends JpaRepository<Aquisicao, UUID> {
}