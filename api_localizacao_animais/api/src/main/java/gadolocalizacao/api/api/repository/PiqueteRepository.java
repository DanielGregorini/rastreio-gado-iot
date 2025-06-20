package gadolocalizacao.api.api.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import gadolocalizacao.api.api.model.Piquete;

public interface PiqueteRepository extends JpaRepository<Piquete, Long> 
{
 List<Piquete> findByPropriedadeId(Long propriedadeId);
}