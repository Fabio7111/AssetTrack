package AssetTrack.controller;

import AssetTrack.dto.UsuarioRequestDTO;
import AssetTrack.dto.UsuarioResponseDTO;
import AssetTrack.model.Usuario;
import AssetTrack.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> cadastrar(@RequestBody UsuarioRequestDTO data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.criarUsuario(data));
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listar() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> atualizar(@PathVariable UUID id, @RequestBody UsuarioRequestDTO data) {
        return ResponseEntity.ok(usuarioService.atualizarUsuario(id, data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(@PathVariable UUID id) {
        usuarioService.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/solicitar-acesso")
    public ResponseEntity<UsuarioResponseDTO> solicitarAcesso(@RequestBody UsuarioRequestDTO data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.registrarAcessoPublico(data));
    }

    public record RecuperarSenhaDTO(String email, String novaSenha) {}

    @PostMapping("/recuperar-senha")
    public ResponseEntity<Void> recuperarSenha(@RequestBody RecuperarSenhaDTO data) {
        usuarioService.redefinirSenha(data.email(), data.novaSenha());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/verificar-email")
    public ResponseEntity<Void> verificarEmail(@RequestParam String email) {
        usuarioService.verificarSeEmailExiste(email);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/me")
    public ResponseEntity<UsuarioResponseDTO> me(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return ResponseEntity.ok(new UsuarioResponseDTO(usuario));
    }

    @PutMapping("/me")
    public ResponseEntity<UsuarioResponseDTO> atualizarMe(
            Authentication authentication,
            @RequestBody UsuarioRequestDTO data) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return ResponseEntity.ok(usuarioService.atualizarUsuario(usuario.getId(), data));
    }

    public record TrocarSenhaDTO(String senhaAtual, String novaSenha) {}

    @PutMapping("/me/senha")
    public ResponseEntity<?> trocarSenha(
            Authentication authentication,
            @RequestBody TrocarSenhaDTO data) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        try {
            usuarioService.trocarSenha(usuario, data.senhaAtual(), data.novaSenha());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}