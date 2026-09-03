package com.projectpos.userservice.repository;

import com.projectpos.userservice.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository
        extends JpaRepository<AppUser, Integer> {

    Optional<AppUser> findByPinCodeAndActiveTrue(String pinCode);

    boolean existsByPinCode(String pinCode);

    boolean existsByPinCodeAndIdNot(
            String pinCode,
            Integer id
    );
}