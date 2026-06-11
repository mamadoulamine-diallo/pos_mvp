package com.projectpos.user.service;

import com.projectpos.user.entity.AppUser;
import com.projectpos.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.projectpos.user.dto.CreateUserRequest;
import com.projectpos.user.dto.UpdateUserRequest;

import java.util.List;

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

    public List<AppUser> findAll() {
        return repository.findAll();
    }

    public AppUser createUser(CreateUserRequest request) {

        if (repository.existsByPinCode(request.pinCode())) {
            throw new IllegalArgumentException(
                    "Ce code PIN est déjà utilisé"
            );
        }

        AppUser user = new AppUser();

        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setPinCode(request.pinCode());
        user.setRole(request.role());
        user.setActive(true);

        return repository.save(user);
    }

    public AppUser updateUser(Integer id, UpdateUserRequest request) {

        if (repository.existsByPinCodeAndIdNot(
                request.pinCode(),
                id
        )) {
            throw new IllegalArgumentException(
                    "Ce code PIN est déjà utilisé");
        }

        AppUser user = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setPinCode(request.pinCode());
        user.setRole(request.role());
        user.setActive(request.active());

        return repository.save(user);
    }
}