package AssetTrack.controller;

import AssetTrack.dto.*;
import AssetTrack.model.Usuario;
import AssetTrack.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/solicitacoes")
public class SolicitacaoController {

    @Autowired private SolicitacaoManutencaoService manutencaoService;
    @Autowired private SolicitacaoEstoqueService    estoqueService;
    @Autowired private AvaliacaoService             avaliacaoService;

    private Usuario usuarioLogado(Authentication auth) {
        return (Usuario) auth.getPrincipal();
    }

    @GetMapping("/manutencao")
    public ResponseEntity<?> listarManutencao() {
        return ResponseEntity.ok(manutencaoService.listarTodas());
    }

    @GetMapping("/manutencao/minhas")
    public ResponseEntity<?> minhasManutencao(Authentication auth) {
        return ResponseEntity.ok(manutencaoService.listarPorUsuario(usuarioLogado(auth).getId()));
    }

    @PostMapping("/manutencao")
    public ResponseEntity<?> abrirManutencao(@RequestBody SolicitacaoManutencaoRequestDTO data, Authentication auth) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(manutencaoService.abrir(data, usuarioLogado(auth)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/manutencao/{id}/status")
    public ResponseEntity<?> statusManutencao(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(manutencaoService.atualizarStatus(id, body.get("status")));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/estoque")
    public ResponseEntity<?> listarEstoque() {
        return ResponseEntity.ok(estoqueService.listarTodas());
    }

    @GetMapping("/estoque/minhas")
    public ResponseEntity<?> minhasEstoque(Authentication auth) {
        return ResponseEntity.ok(estoqueService.listarPorUsuario(usuarioLogado(auth).getId()));
    }

    @PostMapping("/estoque")
    public ResponseEntity<?> abrirEstoque(@RequestBody SolicitacaoEstoqueRequestDTO data, Authentication auth) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(estoqueService.abrir(data, usuarioLogado(auth)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/estoque/{id}/status")
    public ResponseEntity<?> statusEstoque(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(estoqueService.atualizarStatus(id, body.get("status")));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/avaliar")
    public ResponseEntity<?> avaliar(@RequestBody AvaliacaoRequestDTO data, Authentication auth) {
        try {
            avaliacaoService.avaliar(data, usuarioLogado(auth));
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Avaliação registrada."));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}