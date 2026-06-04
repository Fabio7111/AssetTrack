package AssetTrack.repository;

import AssetTrack.model.Aquisicao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.UUID;

@Repository
public interface AquisicaoRepository extends JpaRepository<Aquisicao, UUID> {

    // A consulta fica aqui dentro da interface
    @Query("SELECT SUM(a.valorTotal) FROM Aquisicao a")
    BigDecimal somarTotalInvestimentos();

}