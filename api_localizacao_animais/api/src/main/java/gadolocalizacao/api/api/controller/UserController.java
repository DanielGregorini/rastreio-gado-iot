package gadolocalizacao.api.api.controller;

import java.time.Duration;
import java.util.Optional;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import gadolocalizacao.api.api.dto.LoginRequest;
import gadolocalizacao.api.api.dto.UserDTO;
import gadolocalizacao.api.api.model.User;
import gadolocalizacao.api.api.repository.UserRepository;
import gadolocalizacao.api.api.security.JwtUtil;  // sua classe de geração de token

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody @Valid LoginRequest login,
            HttpServletResponse response) {

        return userRepository.findByUsername(login.getUsername())
            .filter(u -> u.getPassword().equals(login.getPassword()))
            .map(u -> {
                // gera o token
                String token = jwtUtil.generateToken(u.getUsername());

                // monta o cookie HttpOnly
                ResponseCookie cookie = ResponseCookie.from("jwt", token)
                        .httpOnly(true)
                        .path("/")
                        .maxAge(Duration.ofDays(1))
                        .build();

                // adiciona no header
                response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

                // retorna o cookie no corpo também
                return ResponseEntity.ok()
                        .header(HttpHeaders.SET_COOKIE, cookie.toString())
                        .body(cookie.toString());
            })
            .orElseGet(() -> ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Credenciais inválidas"));
    }

    @GetMapping
    public Page<User> listar(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> obterPorId(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Registra um novo usuário, gera um JWT, coloca num cookie HttpOnly e
     * devolve o próprio cookie também no corpo da resposta.
     */
    @PostMapping
    public ResponseEntity<String> criar(
            @RequestBody @Valid UserDTO dto,
            HttpServletResponse response) {

        // Salva o usuário
        User salvo = userRepository.save(dto.toUser());

        // Gera o JWT (por exemplo, com username como "subject")
        String token = jwtUtil.generateToken(salvo.getUsername());

        // Cria o cookie HttpOnly
        ResponseCookie jwtCookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .build();

        // Adiciona o Set-Cookie no header
        response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());

        // Retorna CREATED com o cookie no header e no corpo
        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(jwtCookie.toString());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid UserDTO dto) {

        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = opt.get();
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());
        User atualizado = userRepository.save(user);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
