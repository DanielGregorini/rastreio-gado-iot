package gadolocalizacao.api.api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@Table(name = "piquetes")
public class Piquete extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "propriedade_id")
    
    @JsonBackReference
    private Propriedade propriedade;

    private String nome;

    @JsonIgnore
    @OneToMany(mappedBy = "piquete", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
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
