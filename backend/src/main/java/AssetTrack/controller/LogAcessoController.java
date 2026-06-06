package AssetTrack.controller;

import AssetTrack.dto.LogAcessoResponseDTO;
import AssetTrack.model.Usuario;
import AssetTrack.service.LogAcessoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/log-acessos")
public class LogAcessoController {

    @Autowired
    private LogAcessoService logAcessoService;

    @GetMapping("/me")
    public ResponseEntity<List<LogAcessoResponseDTO>> meuHistorico(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return ResponseEntity.ok(logAcessoService.listarPorUsuario(usuario));
    }
}