package com.projectpos.userservice.service;

import com.projectpos.userservice.dto.CreateUserRequest;
import com.projectpos.userservice.dto.UpdateUserRequest;
import com.projectpos.userservice.entity.AppUser;
import com.projectpos.userservice.entity.UserRole;
import com.projectpos.userservice.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository repository;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(repository);
    }

    /*
     * TEST 1
     *
     * Vérifie qu'un utilisateur actif peut
     * s'authentifier avec un PIN valide.
     */
    @Test
    void shouldAuthenticateActiveUserWithValidPin() {

        AppUser user = new AppUser();
        user.setId(1);
        user.setFullName("Mamadou Diallo");
        user.setPinCode("1234");
        user.setRole(UserRole.GERANT);
        user.setActive(true);

        when(repository.findByPinCodeAndActiveTrue("1234"))
                .thenReturn(Optional.of(user));

        AppUser result =
                userService.authenticate("1234");

        assertSame(user, result);

        assertEquals(
                "Mamadou Diallo",
                result.getFullName()
        );

        assertEquals(
                UserRole.GERANT,
                result.getRole()
        );

        verify(repository)
                .findByPinCodeAndActiveTrue("1234");
    }

    /*
     * TEST 2
     *
     * Vérifie qu'un PIN invalide provoque
     * le rejet de l'authentification.
     */
    @Test
    void shouldRejectAuthenticationWithInvalidPin() {

        when(repository.findByPinCodeAndActiveTrue("9999"))
                .thenReturn(Optional.empty());

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> userService.authenticate("9999")
                );

        assertEquals(
                "PIN invalide",
                exception.getMessage()
        );
    }

    /*
     * TEST 3
     *
     * Vérifie qu'un utilisateur ne peut pas
     * être créé avec un PIN déjà utilisé.
     *
     * Aucune sauvegarde ne doit avoir lieu.
     */
    @Test
    void shouldRejectUserCreationWhenPinAlreadyExists() {

        CreateUserRequest request =
                new CreateUserRequest(
                        "Mamadou Diallo",
                        "mamadou@example.com",
                        "1234",
                        UserRole.GERANT
                );

        when(repository.existsByPinCode("1234"))
                .thenReturn(true);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> userService.createUser(request)
                );

        assertEquals(
                "Ce code PIN est déjà utilisé",
                exception.getMessage()
        );

        verify(repository, never())
                .save(any(AppUser.class));
    }

    /*
     * TEST 4
     *
     * Vérifie la création normale d'un utilisateur.
     *
     * Le service doit notamment forcer active=true
     * lors de la création.
     */
    @Test
    void shouldCreateUserWhenPinIsAvailable() {

        CreateUserRequest request =
                new CreateUserRequest(
                        "Mamadou Diallo",
                        "mamadou@example.com",
                        "1234",
                        UserRole.GERANT
                );

        when(repository.existsByPinCode("1234"))
                .thenReturn(false);

        when(repository.save(any(AppUser.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        AppUser result =
                userService.createUser(request);

        assertEquals(
                "Mamadou Diallo",
                result.getFullName()
        );

        assertEquals(
                "mamadou@example.com",
                result.getEmail()
        );

        assertEquals(
                "1234",
                result.getPinCode()
        );

        assertEquals(
                UserRole.GERANT,
                result.getRole()
        );

        assertTrue(result.getActive());

        verify(repository)
                .save(any(AppUser.class));
    }

    /*
     * TEST 5
     *
     * Vérifie que lors d'une modification,
     * le nouveau PIN ne peut pas appartenir
     * à un autre utilisateur.
     */
    @Test
    void shouldRejectUpdateWhenPinBelongsToAnotherUser() {

        UpdateUserRequest request =
                new UpdateUserRequest(
                        "Mamadou Diallo",
                        "mamadou@example.com",
                        "5678",
                        UserRole.GERANT,
                        true
                );

        when(
                repository.existsByPinCodeAndIdNot(
                        "5678",
                        1
                )
        ).thenReturn(true);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> userService.updateUser(
                                1,
                                request
                        )
                );

        assertEquals(
                "Ce code PIN est déjà utilisé",
                exception.getMessage()
        );

        /*
         * Le service doit s'arrêter avant même
         * de chercher/modifier l'utilisateur.
         */
        verify(repository, never())
                .findById(anyInt());

        verify(repository, never())
                .save(any(AppUser.class));
    }

    /*
     * TEST 6
     *
     * Vérifie la modification normale
     * d'un utilisateur lorsque le PIN
     * reste disponible.
     */
    @Test
    void shouldUpdateUserWhenPinIsAvailable() {

        AppUser existingUser = new AppUser();
        existingUser.setId(1);
        existingUser.setFullName("Ancien nom");
        existingUser.setEmail("old@example.com");
        existingUser.setPinCode("1234");
        existingUser.setRole(UserRole.VENDEUR);
        existingUser.setActive(true);

        UpdateUserRequest request =
                new UpdateUserRequest(
                        "Nouveau nom",
                        "new@example.com",
                        "5678",
                        UserRole.GERANT,
                        false
                );

        when(
                repository.existsByPinCodeAndIdNot(
                        "5678",
                        1
                )
        ).thenReturn(false);

        when(repository.findById(1))
                .thenReturn(Optional.of(existingUser));

        when(repository.save(existingUser))
                .thenReturn(existingUser);

        AppUser result =
                userService.updateUser(
                        1,
                        request
                );

        assertEquals(
                "Nouveau nom",
                result.getFullName()
        );

        assertEquals(
                "new@example.com",
                result.getEmail()
        );

        assertEquals(
                "5678",
                result.getPinCode()
        );

        assertEquals(
                UserRole.GERANT,
                result.getRole()
        );

        assertFalse(result.getActive());

        verify(repository)
                .save(existingUser);
    }
}