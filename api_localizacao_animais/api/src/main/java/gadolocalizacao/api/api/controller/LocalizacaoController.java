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

import gadolocalizacao.api.api.dto.LocalizacaoDTO;
import gadolocalizacao.api.api.model.Localizacao;
import gadolocalizacao.api.api.repository.LocalizacaoRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/localizacoes")
public class LocalizacaoController {

    @Autowired
    private LocalizacaoRepository localizacaoRepository;

    @GetMapping
    public Page<Localizacao> listar(Pageable pageable) {
        return localizacaoRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Localizacao> obterPorId(@PathVariable Long id) {
        return localizacaoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Localizacao> criar(@RequestBody @Valid LocalizacaoDTO localizacao) {
        Localizacao salva = localizacaoRepository.save(localizacao.toLocalizacao());
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!localizacaoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        localizacaoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
 