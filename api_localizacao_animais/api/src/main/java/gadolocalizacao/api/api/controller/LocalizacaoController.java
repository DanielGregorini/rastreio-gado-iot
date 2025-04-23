package gadolocalizacao.api.api.controller;

import gadolocalizacao.api.api.model.Localizacao;
import gadolocalizacao.api.api.repository.LocalizacaoRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/localizacoes")
public class LocalizacaoController {

    @Autowired
    private LocalizacaoRepository localizacaoRepository;

    // GET paginado
    @GetMapping
    public Page<Localizacao> listar(Pageable pageable) {
        return localizacaoRepository.findAll(pageable);
    }

    // GET por ID
    @GetMapping("/{id}")
    public ResponseEntity<Localizacao> obterPorId(@PathVariable Long id) {
        return localizacaoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST - criar nova
    @PostMapping
    public ResponseEntity<Localizacao> criar(@RequestBody @Valid Localizacao localizacao) {
        Localizacao salva = localizacaoRepository.save(localizacao);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    // PUT - atualizar existente
    @PutMapping("/{id}")
    public ResponseEntity<Localizacao> atualizar(@PathVariable Long id, @RequestBody @Valid Localizacao localizacaoAtualizada) {
        return localizacaoRepository.findById(id).map(localizacao -> {
            localizacao.setLatitude(localizacaoAtualizada.getLatitude());
            localizacao.setLongitude(localizacaoAtualizada.getLongitude());
            localizacao.setDataHora(localizacaoAtualizada.getDataHora());
            localizacao.setDispositivo(localizacaoAtualizada.getDispositivo());
            return ResponseEntity.ok(localizacaoRepository.save(localizacao));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE - remover por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!localizacaoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        localizacaoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
