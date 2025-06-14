package gadolocalizacao.api.api.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import gadolocalizacao.api.api.model.Dispositivo;
import gadolocalizacao.api.api.model.Localizacao;

@Getter
@Setter
public class LocalizacaoDTO {

    @NotNull(message = "Latitude é obrigatória")
    private Double latitude;

    @NotNull(message = "Longitude é obrigatória")
    private Double longitude;

    @NotNull(message = "Data e hora são obrigatórios")
    private LocalDateTime dataHora;

    @NotNull(message = "O dispositivoId é obrigatório")
    private Long dispositivoId;

    public Localizacao toLocalizacao() {
        Localizacao loc = new Localizacao();
        loc.setLatitude(this.latitude);
        loc.setLongitude(this.longitude);
        loc.setDataHora(this.dataHora);

        // Criação apenas com o ID (sem buscar do banco)
        Dispositivo disp = new Dispositivo();
        disp.setId(this.dispositivoId);
        loc.setDispositivo(disp);

        return loc;
    }

    public static LocalizacaoDTO fromEntity(Localizacao loc) {
        LocalizacaoDTO dto = new LocalizacaoDTO();
        dto.setLatitude(loc.getLatitude());
        dto.setLongitude(loc.getLongitude());
        dto.setDataHora(loc.getDataHora());

        if (loc.getDispositivo() != null && loc.getDispositivo().getId() != null) {
            dto.setDispositivoId(loc.getDispositivo().getId());
        }

        return dto;
    }
}
