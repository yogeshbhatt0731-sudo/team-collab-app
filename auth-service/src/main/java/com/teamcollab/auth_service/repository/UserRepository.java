package com.teamcollab.auth_service.repository;

import com.teamcollab.auth_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {


    boolean existsByEmail(String email);

    boolean existsByUserName(String password);

    Optional<User> findByUserName(String userName);
}
