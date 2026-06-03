package AssetTrack.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "item_estoque")
@Data
@NoArgsConstructor
public class ItemEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idItem;

    @Column(name = "nome_item", nullable = false, length = 150)
    private String nomeItem;

    @Column(length = 50)
    private String categoria;

    @Column(name = "quantidade_disponivel", nullable = false)
    private Integer quantidadeDisponivel = 0;
}