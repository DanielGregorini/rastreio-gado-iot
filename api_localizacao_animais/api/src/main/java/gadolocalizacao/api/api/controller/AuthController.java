package gadolocalizacao.api.api.controller;

import java.time.Duration;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gadolocalizacao.api.api.dto.LoginRequest;
import gadolocalizacao.api.api.repository.UserRepository;
import gadolocalizacao.api.api.security.JwtUtil;

/**
 * Controller responsável pelo endpoint de autenticação (login).
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Endpoint de login que gera um JWT e retorna em cookie HttpOnly.
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody @Valid LoginRequest login, HttpServletResponse response) {

        return userRepository.findByUsername(login.getUsername())
            .filter(u -> u.getPassword().equals(login.getPassword()))
            .map(u -> {
                // Gera o token
                String token = jwtUtil.generateToken(u.getUsername());

                // Monta o cookie HttpOnly
                ResponseCookie cookie = ResponseCookie.from("jwt", token)
                        .httpOnly(true)
                        .path("/")
                        .maxAge(Duration.ofDays(1))
                        .build();

                // Adiciona no header
                response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

                // Retorna OK com o cookie no header
                return ResponseEntity.ok()
                        .header(HttpHeaders.SET_COOKIE, cookie.toString())
                        .body(cookie.toString());
            })
            .orElseGet(() -> ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Credenciais inválidas"));
    }
}
