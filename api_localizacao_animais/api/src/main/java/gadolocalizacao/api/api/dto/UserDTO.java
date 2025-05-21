package gadolocalizacao.api.api.dto;

import java.util.List;

import gadolocalizacao.api.api.model.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {

    @NotBlank
    @Size(min = 3, max = 100)
    private String username;

    @NotBlank
    @Size(min = 3, max = 300)
    private String email;

    @NotBlank
    @Size(min = 3, max = 100)
    private String password;

    @NotBlank
    @Size(min = 3, max = 100)
    private String role;

    public User toUser() {
        User user = new User();
        user.setUsername(this.username);
        user.setEmail(this.email);
        user.setPassword(this.password);
        user.setRole(this.role);
        return user;
    }
}
