package AssetTrack.controller;

import AssetTrack.dto.*;
import AssetTrack.model.Usuario;
import AssetTrack.service.AuditoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/auditorias")
public class AuditoriaController {

    @Autowired private AuditoriaService service;

    private Usuario usuarioLogado(Authentication auth) {
        return (Usuario) auth.getPrincipal();
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody AuditoriaRequestDTO data, Authentication auth) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(service.registrar(data, usuarioLogado(auth)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/iniciar")
    public ResponseEntity<?> iniciar(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.iniciar(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/planilha")
    public ResponseEntity<?> planilha(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.planilhaDe(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/itens")
    public ResponseEntity<?> itensSalvos(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.itensSalvos(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/enviar")
    public ResponseEntity<?> enviar(@PathVariable UUID id,
                                    @RequestBody List<AuditoriaItemRequestDTO> itens,
                                    Authentication auth) {
        try {
            service.enviar(id, itens, usuarioLogado(auth));
            return ResponseEntity.ok(Map.of("message", "Auditoria enviada e ajustes aplicados."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}