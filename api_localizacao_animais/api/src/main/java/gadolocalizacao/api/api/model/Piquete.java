package gadolocalizacao.api.api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "piquetes")
public class Piquete extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "propriedade_id")
    private Propriedade propriedade;

    private String nome;

    @OneToMany(mappedBy = "piquete", cascade = CascadeType.ALL)
    private List<Animal> animal;

    public Piquete() {
    }

    public Piquete(String nome, Propriedade propriedade, List<Animal> animal) {
        this.nome = nome;
        this.propriedade = propriedade;
        this.animal = animal;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Propriedade getPropriedade() {
        return propriedade;
    }


    public void setPropriedade(Propriedade propriedade) {
        this.propriedade = propriedade;
    }

    public List<Animal> getAnimal() {
        return animal;
    }

    public void setAnimal(List<Animal> animal) {
        this.animal = animal;
    }

}
