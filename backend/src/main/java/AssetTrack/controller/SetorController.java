package AssetTrack.controller;

import AssetTrack.dto.SetorRequestDTO;
import AssetTrack.dto.SetorResponseDTO;
import AssetTrack.service.SetorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}