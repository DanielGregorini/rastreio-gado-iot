package gadolocalizacao.api.api.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate cognitoRestTemplate() {
        RestTemplate rest = new RestTemplate();
        for (HttpMessageConverter<?> conv : rest.getMessageConverters()) {
            if (conv instanceof MappingJackson2HttpMessageConverter jackson) {
                List<MediaType> types = new ArrayList<>(jackson.getSupportedMediaTypes());
                types.add(MediaType.valueOf("application/x-amz-json-1.1"));
                jackson.setSupportedMediaTypes(types);
            }
        }
        return rest;
    }
}
