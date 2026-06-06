package AssetTrack.repository;

import AssetTrack.model.LogAcesso;
import AssetTrack.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LogAcessoRepository extends JpaRepository<LogAcesso, UUID> {
    List<LogAcesso> findByUsuarioOrderByDataHoraDesc(Usuario usuario);
}