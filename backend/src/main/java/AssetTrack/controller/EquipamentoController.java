package AssetTrack.controller;

import AssetTrack.dto.EquipamentoRequestDTO;
import AssetTrack.dto.EquipamentoResponseDTO;
import AssetTrack.service.EquipamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/equipamentos")
public class EquipamentoController {

    @Autowired
    private EquipamentoService equipamentoService;

    @PostMapping
    public ResponseEntity<EquipamentoResponseDTO> cadastrar(@RequestBody EquipamentoRequestDTO data) {
        EquipamentoResponseDTO novoEquipamento = equipamentoService.cadastrarEquipamento(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoEquipamento);
    }

    @GetMapping
    public ResponseEntity<List<EquipamentoResponseDTO>> listar() {
        return ResponseEntity.ok(equipamentoService.listarTodos());
    }
}