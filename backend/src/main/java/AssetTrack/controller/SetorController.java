package AssetTrack.controller;

import AssetTrack.dto.SetorRequestDTO;
import AssetTrack.dto.SetorResponseDTO;
import AssetTrack.service.SetorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/setores")
public class SetorController {

    @Autowired
    private SetorService setorService;

    @PostMapping
    public ResponseEntity<SetorResponseDTO> cadastrar(@RequestBody SetorRequestDTO data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(setorService.cadastrar(data));
    }

    @GetMapping
    public ResponseEntity<List<SetorResponseDTO>> listar() {
        return ResponseEntity.ok(setorService.listarTodos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable UUID id, @RequestBody SetorRequestDTO data) {
        try {
            return ResponseEntity.ok(setorService.atualizar(id, data));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable UUID id) {
        try {
            setorService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}