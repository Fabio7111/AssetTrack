package AssetTrack.controller;

import AssetTrack.dto.DescarteRequestDTO;
import AssetTrack.dto.DescarteResponseDTO;
import AssetTrack.service.DescarteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/descartes")
public class DescarteController {

    @Autowired
    private DescarteService descarteService;

    @PostMapping
    public ResponseEntity<DescarteResponseDTO> registrarDescarte(@RequestBody DescarteRequestDTO data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(descarteService.registrarDescarte(data));
    }
}