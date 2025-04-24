package gadolocalizacao.api.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import gadolocalizacao.api.api.model.Dispositivo;
import gadolocalizacao.api.api.model.Animal;

@Getter
@Setter
public class DispositivoDTO {

    @NotBlank(message = "O identificador não pode ficar em branco")
    @Size(min = 1, max = 100, message = "O identificador deve ter entre 1 e 100 caracteres")
    private String identificador;

    @NotBlank(message = "O tipo não pode ficar em branco")
    @Size(min = 1, max = 50, message = "O tipo deve ter entre 1 e 50 caracteres")
    private String tipo;

    @NotNull(message = "O campo 'ativo' é obrigatório")
    private Boolean ativo;

    @NotNull(message = "O campo animalId é obrigatório")
    private Long animalId;

    public Dispositivo toDispositivo() {
        Dispositivo disp = new Dispositivo();
        disp.setIdentificador(this.identificador);
        disp.setTipo(this.tipo);
        disp.setAtivo(this.ativo);

        Animal animal = new Animal();
        animal.setId(this.animalId);
        disp.setAnimal(animal);

        return disp;
    }

    public static DispositivoDTO fromEntity(Dispositivo disp) {
        DispositivoDTO dto = new DispositivoDTO();
        dto.setIdentificador(disp.getIdentificador());
        dto.setTipo(disp.getTipo());
        dto.setAtivo(disp.getAtivo());
        if (disp.getAnimal() != null) {
            dto.setAnimalId(disp.getAnimal().getId());
        }
        return dto;
    }
}
