package com.projectpos.user.repository;

import com.projectpos.user.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository
        extends JpaRepository<AppUser, Integer> {

    Optional<AppUser> findByPinCodeAndActiveTrue(
            String pinCode
    );
}