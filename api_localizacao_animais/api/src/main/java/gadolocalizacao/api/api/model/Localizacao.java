package gadolocalizacao.api.api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "localizacoes")
public class Localizacao extends BaseEntity {

    private Double latitude;
    private Double longitude;
    private LocalDateTime dataHora;

    @ManyToOne
    @JoinColumn(name = "dispositivo_id")
    private Dispositivo dispositivo;

    public Localizacao() {
    }

    public Localizacao(Double latitude, Double longitude, LocalDateTime dataHora, Dispositivo dispositivo) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.dataHora = dataHora;
        this.dispositivo = dispositivo;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public Dispositivo getDispositivo() {
        return dispositivo;
    }

    public void setDispositivo(Dispositivo dispositivo) {
        this.dispositivo = dispositivo;
    }
}
