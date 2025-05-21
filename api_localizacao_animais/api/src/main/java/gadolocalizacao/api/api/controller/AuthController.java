package gadolocalizacao.api.api.controller;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import gadolocalizacao.api.api.dto.LoginRequest;
import gadolocalizacao.api.api.dto.NewPasswordRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Tag(name = "Autenticação", description = "Endpoints de autenticação via AWS Cognito")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Value("${aws.cognito.url}")
    private String cognitoUrl;

    @Autowired
    private RestTemplate cognitoRestTemplate;   // <-- usa este

    @Value("${aws.cognito.clientId}")
    private String clientId;

    @Value("${aws.cognito.clientSecret}")
    private String clientSecret;

    private final ObjectMapper objectMapper = new ObjectMapper();


    @Operation(
        summary = "Login de usuário",
        description = "Autentica o usuário usando Cognito com USER_PASSWORD_AUTH e retorna o idToken e accessToken.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Login bem-sucedido"),
            @ApiResponse(responseCode = "401", description = "Credenciais inválidas ou usuário não confirmado"),
            @ApiResponse(responseCode = "500", description = "Erro interno")
        }
    )
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest login,
            HttpServletResponse response) {

        try {
            String secretHash = calculateSecretHash(login.getUsername());

            Map<String,Object> authParams = new HashMap<>();
            authParams.put("USERNAME", login.getUsername());
            authParams.put("PASSWORD", login.getPassword());
            authParams.put("SECRET_HASH", secretHash);

            Map<String,Object> body = new HashMap<>();
            body.put("AuthFlow", "USER_PASSWORD_AUTH");
            body.put("ClientId", clientId);
            body.put("AuthParameters", authParams);

            String jsonBody = objectMapper.writeValueAsString(body);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/x-amz-json-1.1");
            headers.set("X-Amz-Target", "AWSCognitoIdentityProviderService.InitiateAuth");

            HttpEntity<String> req = new HttpEntity<>(jsonBody, headers);

            // **USE** o bean injetado aqui: 
            ResponseEntity<JsonNode> resp = cognitoRestTemplate
                .postForEntity(cognitoUrl, req, JsonNode.class);

            if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
                JsonNode authResult = resp.getBody().path("AuthenticationResult");
                String accessToken = authResult.path("AccessToken").asText(null);
                String idToken     = authResult.path("IdToken").asText(null);

                logger.info("AWS Cognito response status: {}", resp.getStatusCode());
            logger.info("AWS Cognito response headers: {}", resp.getHeaders());
            logger.info("AWS Cognito response body: {}", resp.getBody().toPrettyString());

                

                if (accessToken != null && idToken != null) {
                    ResponseCookie cookie = ResponseCookie.from("jwt", accessToken)
                        .httpOnly(true)
                        .secure(true)
                        .sameSite("Strict")
                        .path("/")
                        .maxAge(Duration.ofHours(1))
                        .build();
                    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

                    return ResponseEntity.ok(Map.of(
                        "idToken", idToken,
                        "message", "Login successful"
                    ));
                }
            }

            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid credentials or user not confirmed"));

        } catch (Exception e) {
        
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(
        summary = "Responder desafio NEW_PASSWORD_REQUIRED",
        description = "Responde ao desafio NEW_PASSWORD_REQUIRED do Cognito, definindo uma nova senha e completando o login.",
        responses = {
            @ApiResponse(responseCode = "200", description = "Senha redefinida e login bem-sucedido"),
            @ApiResponse(responseCode = "401", description = "Desafio não satisfeito"),
            @ApiResponse(responseCode = "500", description = "Erro interno ao processar o desafio")
        }
    )
    @PostMapping("/new-password")
    public ResponseEntity<?> respondNewPassword(
            @Valid @RequestBody NewPasswordRequest req,
            HttpServletResponse response) {

        try {
            // Recalcula SECRET_HASH
            String secretHash = calculateSecretHash(req.getUsername());

            // Monta os ChallengeResponses
            Map<String,String> challengeResponses = Map.of(
                "USERNAME", req.getUsername(),
                "NEW_PASSWORD", req.getNewPassword(),
                "SECRET_HASH", secretHash
            );

            // Monta o payload do RespondToAuthChallenge
            Map<String,Object> body = new HashMap<>();
            body.put("ChallengeName", "NEW_PASSWORD_REQUIRED");
            body.put("ClientId", clientId);
            body.put("ChallengeResponses", challengeResponses);
            body.put("Session", req.getSession());

            String jsonBody = objectMapper.writeValueAsString(body);

            // Headers AWS
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.valueOf("application/x-amz-json-1.1"));
            headers.set("X-Amz-Target", "AWSCognitoIdentityProviderService.RespondToAuthChallenge");

            HttpEntity<String> awsReq = new HttpEntity<>(jsonBody, headers);

            // Chama o Cognito
            ResponseEntity<JsonNode> awsResp = cognitoRestTemplate
                .postForEntity(cognitoUrl, awsReq, JsonNode.class);

            JsonNode root = awsResp.getBody();
            JsonNode authResult = root.path("AuthenticationResult");
            String accessToken = authResult.path("AccessToken").asText(null);
            String idToken     = authResult.path("IdToken").asText(null);

            if (accessToken != null && idToken != null) {
                // Gera o cookie com o novo AccessToken
                ResponseCookie cookie = ResponseCookie.from("jwt", accessToken)
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("Strict")
                    .path("/")
                    .maxAge(Duration.ofHours(1))
                    .build();
                response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

                // Retorna o IdToken e uma mensagem de sucesso
                return ResponseEntity.ok(Map.of(
                    "idToken", idToken,
                    "message", "Password changed and login successful"
                ));
            }

            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Challenge not satisfied"));

        } catch (Exception e) {
            logger.error("Erro ao responder NEW_PASSWORD_REQUIRED:", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }

    private String calculateSecretHash(String username) throws Exception {
        String message = username + clientId;
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec keySpec = new SecretKeySpec(
            clientSecret.getBytes(StandardCharsets.UTF_8),
            "HmacSHA256"
        );
        mac.init(keySpec);
        byte[] rawHmac = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(rawHmac);
    }
}
