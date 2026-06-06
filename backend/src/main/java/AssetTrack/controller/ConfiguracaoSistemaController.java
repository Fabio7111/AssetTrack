package AssetTrack.controller;

import AssetTrack.dto.ConfiguracaoSistemaRequestDTO;
import AssetTrack.dto.ConfiguracaoSistemaResponseDTO;
import AssetTrack.service.ConfiguracaoSistemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/configuracoes")
public class ConfiguracaoSistemaController {

    @Autowired
    private ConfiguracaoSistemaService configuracaoService;

    @GetMapping
    public ResponseEntity<ConfiguracaoSistemaResponseDTO> obterConfiguracoes() {
        return ResponseEntity.ok(configuracaoService.getConfiguracao());
    }

    @PutMapping
    public ResponseEntity<ConfiguracaoSistemaResponseDTO> atualizarConfiguracoes(@RequestBody ConfiguracaoSistemaRequestDTO dadosAtualizados) {
        return ResponseEntity.ok(configuracaoService.atualizarConfiguracao(dadosAtualizados));
    }
}