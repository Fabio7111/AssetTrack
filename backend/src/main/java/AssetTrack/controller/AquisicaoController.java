package AssetTrack.controller;

import AssetTrack.dto.AquisicaoRequestDTO;
import AssetTrack.dto.AquisicaoResponseDTO;
import AssetTrack.service.AquisicaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/aquisicoes")
public class AquisicaoController {

    @Autowired
    private AquisicaoService aquisicaoService;

    @PostMapping
    public ResponseEntity<AquisicaoResponseDTO> registrar(@RequestBody AquisicaoRequestDTO data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(aquisicaoService.registrarAquisicao(data));
    }

    @GetMapping
    public ResponseEntity<List<AquisicaoResponseDTO>> listar() {
        return ResponseEntity.ok(aquisicaoService.listarAquisicoes());
    }
}