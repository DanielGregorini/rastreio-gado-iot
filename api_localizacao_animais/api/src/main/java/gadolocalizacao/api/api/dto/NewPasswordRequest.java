package gadolocalizacao.api.api.dto;

import jakarta.validation.constraints.NotBlank;

public class NewPasswordRequest {
    
    @NotBlank
    private String username;

    @NotBlank
    private String newPassword;

    @NotBlank
    private String session; // o campo "Session" que veio no challenge do Cognito

    // getters e setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }

    public String getSession() { return session; }
    public void setSession(String session) { this.session = session; }
}
