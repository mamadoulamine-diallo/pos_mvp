package com.projectpos.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user")
@Getter
@Setter
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user")
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(name = "pin_code", nullable = false, length = 10)
    private String pinCode;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private Boolean active = true;
}