package gadolocalizacao.api.api.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

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
   
    public gadolocalizacao.api.api.model.Localizacao toLocalizacao() {
        var loc = new gadolocalizacao.api.api.model.Localizacao();
        loc.setLatitude(this.latitude);
        loc.setLongitude(this.longitude);
        loc.setDataHora(this.dataHora);
        // aqui só “attach” via id, resolve o relacionamento no Service/Mapper
        var disp = new gadolocalizacao.api.api.model.Dispositivo();
        disp.setId(this.dispositivoId);
        loc.setDispositivo(disp);
        return loc;
    }

    public static LocalizacaoDTO fromLocalizacao(gadolocalizacao.api.api.model.Localizacao ent) {
        var dto = new LocalizacaoDTO();
        dto.setLatitude(ent.getLatitude());
        dto.setLongitude(ent.getLongitude());
        dto.setDataHora(ent.getDataHora());
        if (ent.getDispositivo() != null) {
            dto.setDispositivoId(ent.getDispositivo().getId());
        }
        return dto;
    }
}
