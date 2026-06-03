package com.projectpos.user.service;

import com.projectpos.user.entity.AppUser;
import com.projectpos.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public AppUser authenticate(String pinCode) {

        return repository
                .findByPinCodeAndActiveTrue(pinCode)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "PIN invalide"
                        )
                );
    }
}