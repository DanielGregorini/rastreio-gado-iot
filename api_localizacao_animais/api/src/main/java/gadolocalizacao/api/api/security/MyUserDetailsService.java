package gadolocalizacao.api.api.security;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import gadolocalizacao.api.api.repository.UserRepository;

@Service
public class MyUserDetailsService implements UserDetailsService {

    private final UserRepository userRepo;  // seu JPA repository

    public MyUserDetailsService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        var user = userRepo.findByUsername(username)
            .orElseThrow(() ->
               new UsernameNotFoundException("Usuário não encontrado: " + username));
        return org.springframework.security.core.userdetails.User
            .withUsername(user.getUsername())
            .password(user.getPassword())
            .authorities(user.getRole())
            .build();
    }
}
