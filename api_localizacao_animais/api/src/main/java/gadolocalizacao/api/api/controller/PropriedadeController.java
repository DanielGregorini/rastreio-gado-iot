package gadolocalizacao.api.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gadolocalizacao.api.api.dto.PropriedadeDTO;
import gadolocalizacao.api.api.model.Piquete;
import gadolocalizacao.api.api.model.Propriedade;
import gadolocalizacao.api.api.repository.PiqueteRepository;
import gadolocalizacao.api.api.repository.PropriedadeRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/propriedades")
public class PropriedadeController {

    @Autowired
    private PropriedadeRepository propriedadeRepository;

    @Autowired
    private PiqueteRepository piqueteRepository;

    @GetMapping
    public Page<Propriedade> listar(Pageable pageable) {

        return propriedadeRepository.findAll(pageable);
    }

    @GetMapping("/{id}/piquetes")
    public ResponseEntity<List<Piquete>> listarPiquetes(@PathVariable Long id) {
        if (!propriedadeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        List<Piquete> piquetes = piqueteRepository.findByPropriedadeId(id);
        return ResponseEntity.ok(piquetes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Propriedade> obterPorId(@PathVariable Long id) {
        return propriedadeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Propriedade> criar(@RequestBody @Valid PropriedadeDTO propriedade) {
        Propriedade salva = propriedadeRepository.save(propriedade.toEntity());
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Propriedade> atualizar(@PathVariable Long id, @RequestBody @Valid Propriedade propriedadeAtualizada) {
        return propriedadeRepository.findById(id).map(propriedade -> {
            propriedade.setNome(propriedadeAtualizada.getNome());
            propriedade.setLocalizacao(propriedadeAtualizada.getLocalizacao());
            propriedade.setPiquete(propriedadeAtualizada.getPiquete());
            return ResponseEntity.ok(propriedadeRepository.save(propriedade));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!propriedadeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        propriedadeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
