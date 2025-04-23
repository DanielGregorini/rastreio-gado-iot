package gadolocalizacao.api.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "dispositivos")
public class Dispositivo extends BaseEntity {

    private String identificador;
    private String tipo;
    private Boolean ativo;

    @OneToOne
    @JoinColumn(name = "animal_id")
    private Animal animal;

    public Dispositivo() {
    }

    public Dispositivo(String identificador, String tipo, Boolean ativo, Animal animal) {
        this.identificador = identificador;
        this.tipo = tipo;
        this.ativo = ativo;
        this.animal = animal;
    }

    public String getIdentificador() {
        return identificador;
    }

    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }
}
