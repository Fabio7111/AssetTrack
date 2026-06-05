package AssetTrack.service;

import AssetTrack.dto.UsuarioRequestDTO;
import AssetTrack.dto.UsuarioResponseDTO;
import AssetTrack.model.PerfilAcesso;
import AssetTrack.model.Usuario;
import AssetTrack.repository.PerfilAcessoRepository;
import AssetTrack.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PerfilAcessoRepository perfilRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO data) {
        if(usuarioRepository.findByEmail(data.email()).isPresent()) {
            throw new IllegalArgumentException("Este e-mail já está cadastrado no sistema.");
        }

        PerfilAcesso perfil = perfilRepository.findById(data.idPerfil())
                .orElseThrow(() -> new IllegalArgumentException("Perfil de acesso não encontrado."));

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(data.nome());
        novoUsuario.setEmail(data.email());
        novoUsuario.setSenhaHash(passwordEncoder.encode(data.senha()));
        novoUsuario.setStatus("ATIVO"); // Novo usuário começa ATIVO
        novoUsuario.setPerfil(perfil);

        usuarioRepository.save(novoUsuario);

        return new UsuarioResponseDTO(novoUsuario);
    }

    public UsuarioResponseDTO registrarAcessoPublico(UsuarioRequestDTO data) {
        if(usuarioRepository.findByEmail(data.email()).isPresent()) {
            throw new IllegalArgumentException("Este e-mail já está cadastrado no sistema.");
        }

        PerfilAcesso perfilPadrao = perfilRepository.findByNomePerfil("USUARIO")
                .orElseThrow(() -> new IllegalStateException("Erro interno: Perfil padrão não configurado."));

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(data.nome());
        novoUsuario.setEmail(data.email());
        novoUsuario.setSenhaHash(passwordEncoder.encode(data.senha()));
        novoUsuario.setStatus("ATIVO");
        novoUsuario.setPerfil(perfilPadrao);

        usuarioRepository.save(novoUsuario);

        return new UsuarioResponseDTO(novoUsuario);
    }

    public UsuarioResponseDTO atualizarUsuario(UUID id, UsuarioRequestDTO data) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        usuario.setNome(data.nome());
        usuario.setEmail(data.email());

        if (data.senha() != null && !data.senha().isBlank()) {
            usuario.setSenhaHash(passwordEncoder.encode(data.senha()));
            if ("INATIVO".equals(usuario.getStatus())) {
                usuario.setStatus("ATIVO");
            }
        }

        if (data.idPerfil() != null) {
            PerfilAcesso perfil = perfilRepository.findById(data.idPerfil())
                    .orElseThrow(() -> new IllegalArgumentException("Perfil de acesso não encontrado."));
            usuario.setPerfil(perfil);
        }

        usuarioRepository.save(usuario);
        return new UsuarioResponseDTO(usuario);
    }

    public void redefinirSenha(String email, String novaSenha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("E-mail não encontrado no sistema."));

        usuario.setSenhaHash(passwordEncoder.encode(novaSenha));
        usuario.setStatus("ATIVO");

        usuarioRepository.save(usuario);
    }

    public void deletarUsuario(UUID id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        usuario.setStatus("INATIVO");
        usuarioRepository.save(usuario);
    }

    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(UsuarioResponseDTO::new)
                .toList();
    }

    public void verificarSeEmailExiste(String email) {
        if (usuarioRepository.findByEmail(email).isEmpty()) {
            throw new IllegalArgumentException("E-mail não cadastrado. Por favor, solicite acesso.");
        }
    }
}