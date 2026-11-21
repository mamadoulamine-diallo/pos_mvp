package com.projectpos.shared.security;

import com.projectpos.user.entity.AppUser;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    public AppUser getCurrentUser(HttpSession session) {
        AppUser currentUser = (AppUser) session.getAttribute("currentUser");

        if (currentUser == null) {
            throw new IllegalArgumentException("Utilisateur non connecté");
        }

        return currentUser;
    }

    public boolean isAuthenticated(HttpSession session) {
        return session.getAttribute("currentUser") != null;
    }
}