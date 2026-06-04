package AssetTrack.controller;

import AssetTrack.dto.MovimentacaoRequestDTO;
import AssetTrack.dto.MovimentacaoResponseDTO;
import AssetTrack.service.MovimentacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/movimentacoes")
public class MovimentacaoController {

    @Autowired
    private MovimentacaoService movimentacaoService;

    @PostMapping("/transferir")
    public ResponseEntity<MovimentacaoResponseDTO> transferir(@RequestBody MovimentacaoRequestDTO data) {
        MovimentacaoResponseDTO novaMovimentacao = movimentacaoService.transferirEquipamento(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaMovimentacao);
    }
}