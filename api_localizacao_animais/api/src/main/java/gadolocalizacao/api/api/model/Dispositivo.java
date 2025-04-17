package gadolocalizacao.api.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dispositivos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dispositivo extends BaseEntity {

    private String identificador;

    private String tipo; // "GPS", "Colar", "Sensor de Movimento"

    private Boolean ativo;

    @OneToOne
    @JoinColumn(name = "animal_id")
    private Animal Animal;
}
