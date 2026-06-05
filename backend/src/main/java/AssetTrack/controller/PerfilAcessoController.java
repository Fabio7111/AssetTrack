package AssetTrack.controller;

import AssetTrack.model.PerfilAcesso;
import AssetTrack.repository.PerfilAcessoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/perfis")
public class PerfilAcessoController {

    @Autowired
    private PerfilAcessoRepository repository;

    @GetMapping
    public ResponseEntity<List<PerfilAcesso>> listarTodos() {
        return ResponseEntity.ok(repository.findAll());
    }
}