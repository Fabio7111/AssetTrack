package AssetTrack.controller;

import AssetTrack.dto.MovimentacaoRequestDTO;
import AssetTrack.dto.MovimentacaoResponseDTO;
import AssetTrack.service.MovimentacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/movimentacoes")
public class MovimentacaoController {

    @Autowired
    private MovimentacaoService movimentacaoService;

    @GetMapping
    public ResponseEntity<List<MovimentacaoResponseDTO>> listarTodas() {
        return ResponseEntity.ok(movimentacaoService.listarTodas());
    }

    @PostMapping("/transferir")
    public ResponseEntity<MovimentacaoResponseDTO> transferir(@RequestBody MovimentacaoRequestDTO data) {
        MovimentacaoResponseDTO novaMovimentacao = movimentacaoService.transferirEquipamento(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaMovimentacao);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> atualizar(@PathVariable UUID id, @RequestBody MovimentacaoRequestDTO data) {
        movimentacaoService.atualizarMovimentacao(id, data);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> finalizar(@PathVariable UUID id) {
        movimentacaoService.deletarMovimentacao(id);
        return ResponseEntity.noContent().build();
    }
}