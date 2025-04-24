package gadolocalizacao.api.api.controller;

import org.springframework.beans.BeanUtils;

import gadolocalizacao.api.api.model.Propriedade;
import gadolocalizacao.api.api.repository.PropriedadeRepository;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import gadolocalizacao.api.api.dto.PropriedadeDTO;

@RestController
@RequestMapping("/propriedades")
public class PropriedadeController {

    @Autowired
    private PropriedadeRepository propriedadeRepository;

    @GetMapping
    public Page<Propriedade> listar(Pageable pageable) {
        return propriedadeRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Propriedade> obterPorId(@PathVariable Long id) {
        return propriedadeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Propriedade> criar(@RequestBody @Valid PropriedadeDTO dto) {
        Propriedade propriedade = new Propriedade();
        BeanUtils.copyProperties(dto, propriedade, "id");
        return ResponseEntity.status(HttpStatus.CREATED).body(propriedadeRepository.save(dto.toPropriedade()));
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
