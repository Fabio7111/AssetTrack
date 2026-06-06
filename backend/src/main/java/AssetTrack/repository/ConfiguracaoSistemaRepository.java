package AssetTrack.repository;

import AssetTrack.model.ConfiguracaoSistema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConfiguracaoSistemaRepository extends JpaRepository<ConfiguracaoSistema, UUID> {
    Optional<ConfiguracaoSistema> findFirstBy();
}