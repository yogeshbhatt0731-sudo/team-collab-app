package com.teamcollab.auth_service.repository;

import com.teamcollab.auth_service.dto.UserDetailsDTO;
import com.teamcollab.auth_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {


    boolean existsByEmail(String email);

    boolean existsByUserName(String password);

    Optional<User> findByUserName(String userName);
    Optional<User> findByEmail(String email);
    /*
     private String name;
    private String email;
    private String userName;
    private LocalDateTime createdAt;
     */

    @Query("select new com.teamcollab.auth_service.dto.UserDetailsDTO(u.userId,u.name,u.email,u.userName,u.createdAt) from User u" +
            " where u.userId in :ids")
    List<UserDetailsDTO> findAllByUserIds(@Param("ids") List<Long> ids);

    @Query("select new com.teamcollab.auth_service.dto.UserDetailsDTO(u.userId,u.name,u.email,u.userName,u.createdAt) from User u" +
            " where u.email = :email")
    Optional<UserDetailsDTO> findUserDetailsByEmail(@Param("email") String email);
}
