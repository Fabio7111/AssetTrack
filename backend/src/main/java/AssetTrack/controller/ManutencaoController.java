package AssetTrack.controller;

import AssetTrack.dto.AvaliacaoRequestDTO;
import AssetTrack.dto.SolicitacaoRequestDTO;
import AssetTrack.dto.SolicitacaoResponseDTO;
import AssetTrack.service.ManutencaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/manutencoes")
public class ManutencaoController {

    @Autowired
    private ManutencaoService manutencaoService;

    @PostMapping("/solicitacoes")
    public ResponseEntity<SolicitacaoResponseDTO> abrirChamado(@RequestBody SolicitacaoRequestDTO data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(manutencaoService.abrirSolicitacao(data));
    }

    @PutMapping("/solicitacoes/{id}/status")
    public ResponseEntity<SolicitacaoResponseDTO> atualizarStatus(
            @PathVariable UUID id,
            @RequestParam String novoStatus) {
        return ResponseEntity.ok(manutencaoService.atualizarStatus(id, novoStatus));
    }

    @PostMapping("/avaliacoes")
    public ResponseEntity<String> avaliarServico(@RequestBody AvaliacaoRequestDTO data) {
        manutencaoService.gravarAvaliacao(data);
        return ResponseEntity.status(HttpStatus.CREATED).body("Avaliação registrada com sucesso!");
    }
}