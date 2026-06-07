package AssetTrack.controller;

import AssetTrack.dto.EquipamentoResponseDTO;
import AssetTrack.service.RelatorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/relatorios")
public class RelatorioController {

    @Autowired
    private RelatorioService relatorioService;

    @GetMapping("/equipamentos")
    public ResponseEntity<List<EquipamentoResponseDTO>> gerarRelatorioEquipamentos(

            @RequestParam(required = false)
            String status,

            @RequestParam(required = false)
            String setor

    ) {

        return ResponseEntity.ok(
                relatorioService.gerarRelatorioEquipamentos(status, setor)
        );

    }

    @GetMapping("/equipamentos/excel")
    public ResponseEntity<InputStreamResource> exportarExcelEquipamentos() throws IOException {

        ByteArrayInputStream excel =
                relatorioService.gerarExcelEquipamentos();

        HttpHeaders headers = new HttpHeaders();

        headers.add(
                "Content-Disposition",
                "attachment; filename=equipamentos.xlsx"
        );

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(excel));

    }

    @GetMapping("/equipamentos/pdf")
    public ResponseEntity<InputStreamResource> exportarPdfEquipamentos() {

        ByteArrayInputStream pdf =
                relatorioService.gerarPdfEquipamentos();

        HttpHeaders headers = new HttpHeaders();

        headers.add(
                "Content-Disposition",
                "attachment; filename=equipamentos.pdf"
        );

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));

    }

    @GetMapping("/manutencoes/excel")
    public ResponseEntity<InputStreamResource> exportarExcelManutencoes() throws IOException {

        ByteArrayInputStream excel =
                relatorioService.gerarExcelManutencoes();

        HttpHeaders headers = new HttpHeaders();

        headers.add(
                "Content-Disposition",
                "attachment; filename=manutencoes.xlsx"
        );

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(excel));

    }

    @GetMapping("/manutencoes/pdf")
    public ResponseEntity<InputStreamResource> exportarPdfManutencoes() {

        ByteArrayInputStream pdf =
                relatorioService.gerarPdfManutencoes();

        HttpHeaders headers = new HttpHeaders();

        headers.add(
                "Content-Disposition",
                "attachment; filename=manutencoes.pdf"
        );

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));

    }

    @GetMapping("/movimentacoes/excel")
    public ResponseEntity<InputStreamResource> exportarExcelMovimentacoes() throws IOException {

        ByteArrayInputStream excel =
                relatorioService.gerarExcelMovimentacoes();

        HttpHeaders headers = new HttpHeaders();

        headers.add(
                "Content-Disposition",
                "attachment; filename=movimentacoes.xlsx"
        );

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(excel));

    }

    @GetMapping("/movimentacoes/pdf")
    public ResponseEntity<InputStreamResource> exportarPdfMovimentacoes() {

        ByteArrayInputStream pdf =
                relatorioService.gerarPdfMovimentacoes();

        HttpHeaders headers = new HttpHeaders();

        headers.add(
                "Content-Disposition",
                "attachment; filename=movimentacoes.pdf"
        );

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));

    }

}