package AssetTrack.dto;

import AssetTrack.model.Usuario;
import java.util.UUID;

public record UsuarioResponseDTO(
        UUID id,
        String nome,
        String email,
        String status,
        String nomePerfil
) {
    public UsuarioResponseDTO(Usuario usuario) {
        this(usuario.getId(), usuario.getNome(), usuario.getEmail(),
                usuario.getStatus(), usuario.getPerfil().getNomePerfil());
    }
}