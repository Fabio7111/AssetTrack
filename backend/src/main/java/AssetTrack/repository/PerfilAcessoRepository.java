package AssetTrack.repository;

import AssetTrack.model.PerfilAcesso;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface PerfilAcessoRepository extends JpaRepository<PerfilAcesso, UUID> {

    Optional<PerfilAcesso> findByNomePerfil(String nomePerfil);
}