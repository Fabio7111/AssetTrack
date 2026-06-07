package AssetTrack.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize

                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Autenticação
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/usuarios/solicitar-acesso").permitAll()
                        .requestMatchers(HttpMethod.POST, "/usuarios/recuperar-senha").permitAll()
                        .requestMatchers(HttpMethod.GET, "/usuarios/verificar-email").permitAll()

                        // Perfis
                        .requestMatchers("/perfis", "/perfis/**").permitAll()

                        // Perfil próprio
                        .requestMatchers(HttpMethod.GET, "/usuarios/me").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/usuarios/me").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/usuarios/me/senha").authenticated()

                        // Logs próprios
                        .requestMatchers(HttpMethod.GET, "/log-acessos/me").authenticated()

                        // ==========================
                                // ==========================
                        // USUÁRIOS
                        // ==========================

                        // Listar usuários (necessário para Movimentação e Manutenção)

                        .requestMatchers(HttpMethod.GET, "/usuarios")
                        .hasAnyRole("ADMINISTRADOR", "MODERADOR")

                        // CRUD somente ADMIN
                        .requestMatchers(HttpMethod.POST, "/usuarios")
                        .hasRole("ADMINISTRADOR")

                        .requestMatchers(HttpMethod.PUT, "/usuarios/**")
                        .hasRole("ADMINISTRADOR")

                        .requestMatchers(HttpMethod.DELETE, "/usuarios/**")
                                .hasRole("ADMINISTRADOR")

                        // Demais endpoints de usuários

                        .requestMatchers("/usuarios/**")
                            .hasRole("ADMINISTRADOR")

                        // ==========================
                        // AUDITORIA (Somente ADMIN)
                        // ==========================
                        .requestMatchers("/auditorias/**")
                        .hasRole("ADMINISTRADOR")

                                // ==========================
                                // EQUIPAMENTOS
                                // ==========================

                                // CONSULTA -> TODOS
                                .requestMatchers(HttpMethod.GET, "/equipamentos/**")
                                .hasAnyRole("ADMINISTRADOR", "MODERADOR", "USUARIO")

                                // ALTERAÇÃO -> ADMIN + MODERADOR
                                .requestMatchers(HttpMethod.POST, "/equipamentos/**")
                                .hasAnyRole("ADMINISTRADOR", "MODERADOR")

                                .requestMatchers(HttpMethod.PUT, "/equipamentos/**")
                                .hasAnyRole("ADMINISTRADOR", "MODERADOR")

                                .requestMatchers(HttpMethod.DELETE, "/equipamentos/**")
                                .hasAnyRole("ADMINISTRADOR", "MODERADOR")

                                // ==========================
                                // SETORES
                                // ==========================

                                // CONSULTA -> TODOS
                                .requestMatchers(HttpMethod.GET, "/setores/**")
                                .hasAnyRole("ADMINISTRADOR", "MODERADOR", "USUARIO")

                                // ALTERAÇÃO -> ADMIN + MODERADOR
                                .requestMatchers(HttpMethod.POST, "/setores/**")
                                .hasAnyRole("ADMINISTRADOR", "MODERADOR")

                                .requestMatchers(HttpMethod.PUT, "/setores/**")
                                .hasAnyRole("ADMINISTRADOR", "MODERADOR")

                                .requestMatchers(HttpMethod.DELETE, "/setores/**")
                                .hasAnyRole("ADMINISTRADOR", "MODERADOR")

                        // ==========================
                        // MOVIMENTAÇÕES
                        // ADMIN + MODERADOR
                        // ==========================
                        .requestMatchers("/movimentacoes/**")
                        .hasAnyRole("ADMINISTRADOR", "MODERADOR")

                        // ==========================
                        // ESTOQUE
                        // ADMIN + MODERADOR
                        // ==========================
                        .requestMatchers("/estoque/**")
                        .hasAnyRole("ADMINISTRADOR", "MODERADOR")

                        // ==========================
                        // SOLICITAÇÕES
                        // TODOS
                        // ==========================
                        .requestMatchers("/solicitacoes/**")
                        .hasAnyRole(
                                "ADMINISTRADOR",
                                "MODERADOR",
                                "USUARIO"
                        )

                        // ==========================
                        // CONFIGURAÇÕES
                        // TODOS
                        // ==========================
                        .requestMatchers(HttpMethod.GET, "/configuracoes")
                        .authenticated()

                        .requestMatchers(HttpMethod.PUT, "/configuracoes")
                        .authenticated()

                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}