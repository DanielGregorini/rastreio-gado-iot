package gadolocalizacao.api.api.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import gadolocalizacao.api.api.model.Propriedade;

public interface PropriedadeRepository extends JpaRepository<Propriedade, Long> {
}
