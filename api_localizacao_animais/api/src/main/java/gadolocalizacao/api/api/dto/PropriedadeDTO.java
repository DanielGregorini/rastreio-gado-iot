package gadolocalizacao.api.api.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonManagedReference;

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
    

    public static PropriedadeDTO fromEntity(Propriedade propriedade) {
        PropriedadeDTO dto = new PropriedadeDTO();
        dto.setNome(propriedade.getNome());
        dto.setLocalizacao(propriedade.getLocalizacao());
        //if (propriedade.getPiquete() != null) {
           // dto.setPiquetes(propriedade.getPiquete()
           //     .stream()
            //    .map(PiqueteDTO::fromEntity)
            //    .collect(Collectors.toList()));
       // }
        return dto;
    }

    public Propriedade toEntity() {
        Propriedade propriedade = new Propriedade();
        propriedade.setNome(this.nome);
        propriedade.setLocalizacao(this.localizacao);
        // piquetes não precisam ser setados ao salvar uma propriedade nova
        return propriedade;
    }


    public void setNome(String nome) {
        this.nome = nome;
    }
    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }


}
