package gadolocalizacao.api.api.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import gadolocalizacao.api.api.model.Dispositivo;

public interface DispositivoRepository extends JpaRepository<Dispositivo, Long> {
 
}
