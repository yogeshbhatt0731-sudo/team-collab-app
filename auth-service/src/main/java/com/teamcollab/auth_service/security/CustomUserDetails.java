package com.teamcollab.auth_service.security;

import com.teamcollab.auth_service.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;


@Getter
@AllArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final Long userId;
    private final String name;
    private final String userName;
    private final String password;


    public CustomUserDetails(User user){
        this.userId= user.getUserId();
        this.name= user.getName();
        this.userName= user.getUserName();
        this.password =user.getPasswordHashed();
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public @Nullable String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return userName;
    }

}
