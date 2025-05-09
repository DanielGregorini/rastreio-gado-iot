package gadolocalizacao.api.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gadolocalizacao.api.api.dto.AnimalDTO;
import gadolocalizacao.api.api.model.Animal;
import gadolocalizacao.api.api.repository.AnimalRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/animais")
public class AnimalController {

    @Autowired
    private AnimalRepository animalRepository;

    @GetMapping
    public Page<Animal> listar(Pageable pageable) {
        return animalRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Animal> obterPorId(@PathVariable Long id) {
        return animalRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Animal> criar(@RequestBody @Valid AnimalDTO animal) {
        Animal salvo = animalRepository.save(animal.toAnimal());
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Animal> atualizar(@PathVariable Long id, @RequestBody @Valid Animal animalAtualizado) {
        return animalRepository.findById(id).map(animal -> {
            animal.setIdentificador(animalAtualizado.getIdentificador());
            animal.setPiquete(animalAtualizado.getPiquete());
            return ResponseEntity.ok(animalRepository.save(animal));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!animalRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        animalRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
