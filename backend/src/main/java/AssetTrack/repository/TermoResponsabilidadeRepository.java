package AssetTrack.repository;

import AssetTrack.model.TermoResponsabilidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface TermoResponsabilidadeRepository extends JpaRepository<TermoResponsabilidade, UUID> {
    List<TermoResponsabilidade> findByUsuario_IdAndStatusTermo(UUID idUsuario, String status);
    List<TermoResponsabilidade> findByEquipamento_IdEquipamentoOrderByDataEmissaoDesc(UUID idEquipamento);
    List<TermoResponsabilidade> findAllByOrderByDataEmissaoDesc();
}