package gadolocalizacao.api.api.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Propriedade")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Propriedade extends BaseEntity {

    private String nome;
    private String localizacao;

    @OneToMany(mappedBy = "Propriedade", cascade = CascadeType.ALL)
    private List<Piquete> Piquete;
}
