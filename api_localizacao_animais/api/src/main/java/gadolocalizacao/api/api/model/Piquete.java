package gadolocalizacao.api.api.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Piquetes=")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Piquete extends BaseEntity {

    private String nome;

    @ManyToOne
    @JoinColumn(name = "Propriedade_id")
    private Propriedade propriedade;

    @OneToMany(mappedBy = "piquete", cascade = CascadeType.ALL)
    private List<Animal> Animal;

}
