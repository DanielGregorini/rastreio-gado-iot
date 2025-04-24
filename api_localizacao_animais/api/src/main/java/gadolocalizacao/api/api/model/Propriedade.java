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
@Table(name = "propriedades")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Propriedade extends BaseEntity {

    private String nome;
    private String localizacao;

<<<<<<< HEAD
    @OneToMany(mappedBy = "Propriedade", cascade = CascadeType.ALL)
    private List<Piquete> Piquete;
=======
    @OneToMany(mappedBy = "propriedade", cascade = CascadeType.ALL)
    private List<Piquete> piquete;
>>>>>>> 6e519a8997cf8c8f7d27f608fd3056258f949144
}
