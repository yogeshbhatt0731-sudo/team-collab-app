package com.teamcollab.auth_service.security;

import com.teamcollab.auth_service.entity.User;
import com.teamcollab.auth_service.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private UserRepository userRepository;

//    public CustomUserDetailsService(UserRepository userRepository) {
//        this.userRepository = userRepository;
//    }
    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail)
            throws UsernameNotFoundException {

        Optional<User> user = userRepository.findByUserName(usernameOrEmail);

        if (user.isEmpty()) {
            user = userRepository.findByEmail(usernameOrEmail);
        }

        return user
                .map(CustomUserDetails::new)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found: " + usernameOrEmail
                        )
                );
    }
}
