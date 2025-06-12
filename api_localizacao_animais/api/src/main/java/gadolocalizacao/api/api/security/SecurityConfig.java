package gadolocalizacao.api.api.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import gadolocalizacao.api.api.security.JwtAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    /* 
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
          // desliga CSRF e sessão (stateless JWT)
          .csrf(AbstractHttpConfigurer::disable)
          .sessionManagement(m -> 
             m.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
          )
          // regras de acesso
          .authorizeHttpRequests(auth -> auth
              // libera login JWT e Swagger
              .requestMatchers(
                  "/auth/**",               
                  "/v3/api-docs/**",        
                  "/swagger-ui.html",       
                  "/swagger-ui/**",         
                  "/swagger-ui/index.html"  
              ).permitAll()
              // o resto exige JWT
              .anyRequest().authenticated()
          )
          // desativa completamente o Basic Auth e o formLogin
          .httpBasic(AbstractHttpConfigurer::disable)
          .formLogin(AbstractHttpConfigurer::disable);

        // injeta seu filtro JWT antes do filtro de autenticação padrão
        http.addFilterBefore(
            jwtFilter, 
            UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors().and()
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(m -> m.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable);

        return http.build();
    }

}
