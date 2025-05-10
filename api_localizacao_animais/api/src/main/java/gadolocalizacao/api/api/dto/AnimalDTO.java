package gadolocalizacao.api.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import gadolocalizacao.api.api.model.Animal;
import gadolocalizacao.api.api.model.Piquete;

@Getter
@Setter
public class AnimalDTO {

    @NotBlank(message = "O identificador não pode ficar em branco")
    @Size(min = 1, max = 100, message = "O identificador deve ter entre 1 e 100 caracteres")
    private String identificador;

    @NotNull(message = "O campo piqueteId é obrigatório")
    private Long piqueteId;

    public Animal toAnimal() {
        Animal animal = new Animal();
        animal.setIdentificador(this.identificador);

        Piquete piquete = new Piquete();
        //piquete.setId(this.piqueteId);
        animal.setPiquete(piquete);

        return animal;
    }

    public static AnimalDTO fromEntity(Animal animal) {
        AnimalDTO dto = new AnimalDTO();
        dto.setIdentificador(animal.getIdentificador());
        dto.setPiqueteId(animal.getPiquete().getId());
        return dto;
    }

    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }

    public void setPiqueteId(Long piqueteId) {
        this.piqueteId = piqueteId;
    }
}
