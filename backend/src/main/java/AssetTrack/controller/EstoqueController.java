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
@RequestMapping("/estoque")
public class EstoqueController {

    @Autowired private ItemEstoqueService          itemService;
    @Autowired private UnidadeEstoqueService       unidadeService;
    @Autowired private MovimentacaoEstoqueService  movimentacaoService;

    @GetMapping
    public ResponseEntity<List<ItemEstoqueResponseDTO>> listarItens() {
        return ResponseEntity.ok(itemService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemEstoqueResponseDTO> buscarItem(@PathVariable UUID id) {
        return ResponseEntity.ok(itemService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ItemEstoqueResponseDTO> cadastrarItem(@RequestBody ItemEstoqueRequestDTO data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(itemService.cadastrar(data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarItem(@PathVariable UUID id, @RequestBody ItemEstoqueRequestDTO data) {
        try {
            return ResponseEntity.ok(itemService.atualizar(id, data));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarItem(@PathVariable UUID id) {
        try {
            itemService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/unidades")
    public ResponseEntity<List<UnidadeEstoqueResponseDTO>> listarUnidades() {
        return ResponseEntity.ok(unidadeService.listarTodas());
    }

    @GetMapping("/{idItem}/unidades")
    public ResponseEntity<List<UnidadeEstoqueResponseDTO>> listarUnidadesPorItem(@PathVariable UUID idItem) {
        return ResponseEntity.ok(unidadeService.listarPorItem(idItem));
    }

    @PostMapping("/unidades")
    public ResponseEntity<UnidadeEstoqueResponseDTO> cadastrarUnidade(@RequestBody UnidadeEstoqueRequestDTO data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(unidadeService.cadastrar(data));
    }

    @PutMapping("/unidades/{id}")
    public ResponseEntity<?> atualizarUnidade(@PathVariable UUID id, @RequestBody UnidadeEstoqueRequestDTO data) {
        try {
            return ResponseEntity.ok(unidadeService.atualizar(id, data));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/unidades/{id}")
    public ResponseEntity<?> deletarUnidade(@PathVariable UUID id) {
        try {
            unidadeService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/movimentacoes")
    public ResponseEntity<List<MovimentacaoEstoqueResponseDTO>> listarMovimentacoes() {
        return ResponseEntity.ok(movimentacaoService.listarTodas());
    }

    @GetMapping("/{idItem}/movimentacoes")
    public ResponseEntity<List<MovimentacaoEstoqueResponseDTO>> listarMovimentacoesPorItem(@PathVariable UUID idItem) {
        return ResponseEntity.ok(movimentacaoService.listarPorItem(idItem));
    }

    @PostMapping("/movimentacoes")
    public ResponseEntity<?> registrarMovimentacao(
            @RequestBody MovimentacaoEstoqueRequestDTO data,
            Authentication authentication) {
        try {
            Usuario usuario = (Usuario) authentication.getPrincipal();
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(movimentacaoService.registrar(data, usuario));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }
}