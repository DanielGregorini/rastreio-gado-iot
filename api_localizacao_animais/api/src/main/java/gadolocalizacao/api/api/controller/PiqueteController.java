package gadolocalizacao.api.api.controller;

import gadolocalizacao.api.api.model.Piquete;
import gadolocalizacao.api.api.repository.PiqueteRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/piquetes")
public class PiqueteController {

    @Autowired
    private PiqueteRepository piqueteRepository;

    @GetMapping
    public Page<Piquete> listar(Pageable pageable) {
        return piqueteRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Piquete> obterPorId(@PathVariable Long id) {
        return piqueteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Piquete> criar(@RequestBody @Valid Piquete piquete) {
        Piquete salvo = piqueteRepository.save(piquete);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Piquete> atualizar(@PathVariable Long id, @RequestBody @Valid Piquete piqueteAtualizado) {
        return piqueteRepository.findById(id).map(piquete -> {
            piquete.setNome(piqueteAtualizado.getNome());
            piquete.setPropriedade(piqueteAtualizado.getPropriedade());
            piquete.setAnimal(piqueteAtualizado.getAnimal());
            return ResponseEntity.ok(piqueteRepository.save(piquete));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!piqueteRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        piqueteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
