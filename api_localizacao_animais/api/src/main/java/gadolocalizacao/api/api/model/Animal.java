package gadolocalizacao.api.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "animais")
public class Animal extends BaseEntity {

    private String identificador;

    @ManyToOne
    @JoinColumn(name = "piquete_id")
    private Piquete piquete;

    public Animal() {
    }

    public Animal(String identificador, Piquete piquete) {
        this.identificador = identificador;
        this.piquete = piquete;
    }

    public String getIdentificador() {
        return identificador;
    }

    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }

    public Piquete getPiquete() {
        return piquete;
    }

    public void setPiquete(Piquete piquete) {
        this.piquete = piquete;
    }
}
