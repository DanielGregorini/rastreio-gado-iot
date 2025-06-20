package gadolocalizacao.api.api.model;

import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "propriedades")
public class Propriedade extends BaseEntity {

    private String nome;
    private String localizacao;

    @OneToMany(mappedBy = "propriedade", cascade = CascadeType.ALL, fetch= FetchType.EAGER)
    
    @JsonManagedReference
    private List<Piquete> piquete;

    public Propriedade() {
    }

    public Propriedade(String nome, String localizacao, List<Piquete> piquete) {
        this.nome = nome;
        this.localizacao = localizacao;
        this.piquete = piquete;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }

    public List<Piquete> getPiquete() {
        return piquete;
    }

    public void setPiquete(List<Piquete> piquete) {
        this.piquete = piquete;
    }
}
