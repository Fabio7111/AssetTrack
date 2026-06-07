package AssetTrack.controller;

import AssetTrack.dto.TermoResponsabilidadeRequestDTO;
import AssetTrack.service.TermoResponsabilidadeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/termos")
public class TermoResponsabilidadeController {

    @Autowired private TermoResponsabilidadeService termoService;

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(termoService.listarTodos());
    }

    @GetMapping("/equipamento/{idEquipamento}")
    public ResponseEntity<?> porEquipamento(@PathVariable UUID idEquipamento) {
        return ResponseEntity.ok(termoService.listarPorEquipamento(idEquipamento));
    }

    @PostMapping
    public ResponseEntity<?> emitir(@RequestBody TermoResponsabilidadeRequestDTO data) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(termoService.emitir(data));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<?> baixarPdf(@PathVariable UUID id) {
        try {
            byte[] pdf = termoService.gerarPdf(id);
            ByteArrayResource resource = new ByteArrayResource(pdf);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=termo_" + id + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(pdf.length)
                    .body(resource);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}