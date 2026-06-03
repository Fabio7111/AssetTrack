package AssetTrack.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "aquisicao")
@Data
@NoArgsConstructor
public class Aquisicao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idAquisicao;

    @Column(nullable = false, length = 150)
    private String fornecedor;

    @Column(name = "data_compra", nullable = false)
    private LocalDate dataCompra;

    @Column(name = "numero_nota_fiscal", length = 50)
    private String numeroNotaFiscal;

    @Column(name = "valor_total", precision = 10, scale = 2)
    private java.math.BigDecimal valorTotal;
}