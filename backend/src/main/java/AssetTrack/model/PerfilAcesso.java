package AssetTrack.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "perfil_acesso")
@Data
@NoArgsConstructor
public class PerfilAcesso {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nome_perfil", nullable = false, unique = true, length = 50)
    private String nomePerfil;

    @Column
    private String descricao;
}