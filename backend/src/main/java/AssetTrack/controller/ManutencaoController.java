package AssetTrack.controller;

import AssetTrack.dto.*;
import AssetTrack.service.ManutencaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/manutencoes")
public class ManutencaoController {

    @Autowired
    private ManutencaoService manutencaoService;

    @GetMapping
    public ResponseEntity<List<ManutencaoResponseDTO>> listar() {
        return ResponseEntity.ok(manutencaoService.listarTodasManutencoes());
    }

    @PostMapping
    public ResponseEntity<Void> registrar(@RequestBody ManutencaoRequestDTO data) {
        manutencaoService.registrarManutencaoDireta(data);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> atualizar(@PathVariable UUID id, @RequestBody ManutencaoRequestDTO data) {
        manutencaoService.atualizarManutencao(id, data);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        manutencaoService.deletarManutencao(id);
        return ResponseEntity.noContent().build();
    }
}