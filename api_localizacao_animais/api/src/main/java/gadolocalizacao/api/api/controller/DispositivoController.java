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

import gadolocalizacao.api.api.dto.DispositivoDTO;
import gadolocalizacao.api.api.model.Dispositivo;
import gadolocalizacao.api.api.repository.DispositivoRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/dispositivos")
public class DispositivoController {

    @Autowired
    private DispositivoRepository dispositivoRepository;

    @GetMapping
    public Page<Dispositivo> listar(Pageable pageable) {
        return dispositivoRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dispositivo> obterPorId(@PathVariable Long id) {
        return dispositivoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<Dispositivo> criar(@RequestBody @Valid DispositivoDTO dispositivo) {
        Dispositivo salvo = dispositivoRepository.save(dispositivo.toDispositivo());
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Dispositivo> atualizar(@PathVariable Long id, @RequestBody @Valid Dispositivo dispositivoAtualizado) {
        return dispositivoRepository.findById(id).map(dispositivo -> {
            dispositivo.setIdentificador(dispositivoAtualizado.getIdentificador());
            dispositivo.setTipo(dispositivoAtualizado.getTipo());
            dispositivo.setAtivo(dispositivoAtualizado.getAtivo());
            dispositivo.setAnimal(dispositivoAtualizado.getAnimal());
            Dispositivo atualizado = dispositivoRepository.save(dispositivo);
            return ResponseEntity.ok(atualizado);
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return dispositivoRepository.findById(id)
                .map(dispositivo -> {
                    dispositivoRepository.delete(dispositivo);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
