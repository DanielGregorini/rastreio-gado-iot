package gadolocalizacao.api.api.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import gadolocalizacao.api.api.model.Localizacao;

public interface LocalizacaoRepository extends JpaRepository<Localizacao, Long> {
    
}
