package gadolocalizacao.api.api.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import gadolocalizacao.api.api.model.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
