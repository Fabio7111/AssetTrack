package AssetTrack.repository;

import AssetTrack.model.Manutencao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ManutencaoRepository extends JpaRepository<Manutencao, UUID> {
    List<Manutencao> findByEquipamento_IdEquipamento(UUID idEquipamento);
}