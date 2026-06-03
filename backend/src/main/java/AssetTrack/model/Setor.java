package AssetTrack.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "setor")
@Data
@NoArgsConstructor
public class Setor {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idSetor;

    @Column(name = "nome_setor", nullable = false, length = 100)
    private String nomeSetor;

    @Column(name = "localizacao_fisica")
    private String localizacaoFisica;

    @OneToMany(mappedBy = "setor")
    private List<Equipamento> equipamentos;
}