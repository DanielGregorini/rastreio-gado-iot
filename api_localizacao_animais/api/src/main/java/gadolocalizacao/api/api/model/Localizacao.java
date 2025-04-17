package gadolocalizacao.api.api.model;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "localizacoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Localizacao extends BaseEntity {

    private Double latitude;

    private Double longitude;

    private LocalDateTime dataHora;

    @ManyToOne
    @JoinColumn(name = "dispositivo_id")
    private Dispositivo dispositivo;
}