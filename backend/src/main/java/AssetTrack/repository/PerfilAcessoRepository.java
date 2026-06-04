package AssetTrack.repository;

import AssetTrack.model.PerfilAcesso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PerfilAcessoRepository extends JpaRepository<PerfilAcesso, UUID> {

    Optional<PerfilAcesso> findByNomePerfil(String nomePerfil);
}