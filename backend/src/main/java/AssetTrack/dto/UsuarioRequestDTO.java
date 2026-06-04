package AssetTrack.dto;

import java.util.UUID;

public record UsuarioRequestDTO(
        String nome,
        String email,
        String senha,
        UUID idPerfil
) {}