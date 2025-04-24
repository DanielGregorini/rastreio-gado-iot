package gadolocalizacao.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnimalDTO {
  private Long id;
  private String identificador;
  private Long piqueteId;
}

