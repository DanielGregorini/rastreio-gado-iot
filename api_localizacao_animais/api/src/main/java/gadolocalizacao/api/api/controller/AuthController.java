package gadolocalizacao.api.api.controller;

import gadolocalizacao.api.api.dto.LoginRequestDTO;
import gadolocalizacao.api.api.dto.TokenResponseDTO;
import gadolocalizacao.api.api.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.annotations.*;

@RestController
@RequestMapping("/auth")
@Api(tags = "Autenticação")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @ApiOperation("Realiza login e retorna um token JWT")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "Login realizado com sucesso"),
        @ApiResponse(code = 401, message = "Credenciais inválidas")
    })
    public ResponseEntity<TokenResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        String token = authService.autenticar(loginRequest.getEmail(), loginRequest.getSenha());
        return ResponseEntity.ok(new TokenResponseDTO(token));
    }
}