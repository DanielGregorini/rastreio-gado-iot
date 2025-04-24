package gadolocalizacao.api.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.stream.Collectors;

import gadolocalizacao.api.api.model.Piquete;
import gadolocalizacao.api.api.model.Propriedade;

@Getter
@Setter
public class PiqueteDTO {

    @NotBlank(message = "O nome do piquete é obrigatório")
    @Size(min = 3, max = 100, message = "O nome do piquete deve ter entre 3 e 100 caracteres")
    private String nome;

    @NotNull(message = "O propriedadeId é obrigatório")
    private Long propriedadeId;

    private List<AnimalDTO> animais;

    public Piquete toPiquete() {
        Piquete piquete = new Piquete();
        piquete.setNome(this.nome);
        Propriedade propriedade = new Propriedade();
        propriedade.setId(this.propriedadeId);
        piquete.setPropriedade(propriedade);
        return piquete;
    }

    public static PiqueteDTO fromPiquete(Piquete piquete) {
        PiqueteDTO dto = new PiqueteDTO();
        dto.setNome(piquete.getNome());
        dto.setPropriedadeId(piquete.getPropriedade().getId());
        if (piquete.getAnimal() != null) {
            dto.setAnimais(
                piquete.getAnimal()
                       .stream()
                       .map(AnimalDTO::fromEntity)
                       .collect(Collectors.toList())
            );
        }
        return dto;
    }
}