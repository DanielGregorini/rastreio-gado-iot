package gadolocalizacao.api.api.controller;

import java.util.Optional;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import gadolocalizacao.api.api.dto.UserDTO;
import gadolocalizacao.api.api.model.User;
import gadolocalizacao.api.api.repository.UserRepository;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;


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
    public ResponseEntity<User> criar(
            @RequestBody @Valid UserDTO dto,
            HttpServletResponse response) {

        // Salva o usuário
        User salvo = userRepository.save(dto.toUser());
        // Retorna CREATED com o cookie no header e no corpo
        return ResponseEntity.ok(salvo);
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
