package AssetTrack.controller;

import AssetTrack.model.Usuario;
import AssetTrack.security.TokenService;
import AssetTrack.service.LogAcessoService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private LogAcessoService logAcessoService;

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody AuthenticationDTO data,
            HttpServletRequest request) {

        var usernamePassword =
                new UsernamePasswordAuthenticationToken(
                        data.email(),
                        data.senha()
                );

        var auth = authenticationManager.authenticate(usernamePassword);

        var usuario = (Usuario) auth.getPrincipal();

        String ip = obterIp(request);
        String userAgent = request.getHeader("User-Agent");
        String dispositivo = resolverDispositivo(userAgent);

        logAcessoService.registrar(
                usuario,
                "Login bem-sucedido — " + ip + " (" + dispositivo + ")"
        );

        var token = tokenService.generateToken(usuario);

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "perfil", usuario.getPerfil().getNomePerfil(),
                        "nome", usuario.getNome(),
                        "email", usuario.getEmail()
                )
        );
    }

    private String obterIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");

        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }

    private String resolverDispositivo(String userAgent) {
        if (userAgent == null) {
            return "Dispositivo desconhecido";
        }

        String ua = userAgent.toLowerCase();

        if (ua.contains("mobile") ||
                ua.contains("android") ||
                ua.contains("iphone")) {
            return "Mobile";
        }

        if (ua.contains("tablet") ||
                ua.contains("ipad")) {
            return "Tablet";
        }

        if (ua.contains("windows")) {
            return "Windows";
        }

        if (ua.contains("macintosh") ||
                ua.contains("mac os")) {
            return "macOS";
        }

        if (ua.contains("linux")) {
            return "Linux";
        }

        return "Navegador";
    }

    public record AuthenticationDTO(
            String email,
            String senha
    ) {}
}