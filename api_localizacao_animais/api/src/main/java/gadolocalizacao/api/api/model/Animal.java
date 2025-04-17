package gadolocalizacao.api.api.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "animais")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Animal extends BaseEntity {
    
    private String identificador;

    @ManyToOne
    @JoinColumn(name = "piquete_id")
    private Piquete piquete;

}
