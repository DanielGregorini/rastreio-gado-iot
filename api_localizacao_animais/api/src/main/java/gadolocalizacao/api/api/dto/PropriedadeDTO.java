package gadolocalizacao.api.api.dto;

import java.util.List;

import gadolocalizacao.api.api.model.Piquete;
import gadolocalizacao.api.api.model.Propriedade;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PropriedadeDTO {

    @NotBlank
    @Size(min = 3, max = 100)
    private String nome;

    @NotBlank
    @Size(min = 3, max = 100)
    private String localizacao;


    private List<Piquete> piquete;

    public Propriedade toPropriedade() {
        Propriedade propriedade = new Propriedade();
        propriedade.setNome(this.nome);
        propriedade.setLocalizacao(this.localizacao);
        return propriedade;
    }
}
