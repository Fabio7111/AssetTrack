package AssetTrack.controller;

import AssetTrack.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/totais")
    public ResponseEntity<Map<String, Object>> getTotais() {
        return ResponseEntity.ok(dashboardService.obterDadosDashboard());
    }
}