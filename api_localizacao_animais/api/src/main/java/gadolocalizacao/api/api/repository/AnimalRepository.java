package gadolocalizacao.api.api.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import gadolocalizacao.api.api.model.Animal;
import gadolocalizacao.api.api.model.Piquete;

public interface AnimalRepository extends JpaRepository<Animal, Long> {

List<Animal> findByPiqueteId(Long animalId);
}
