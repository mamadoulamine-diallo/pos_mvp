package com.projectpos.saleservice.sale.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sale")
@Getter
@Setter
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sale")
    private Integer id;

    @Column(name = "sale_date", nullable = false)
    private LocalDateTime saleDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SaleStatus status = SaleStatus.BROUILLON;

    @Column(name = "id_user", nullable = false)
    private Integer userId;

    @OneToMany(
            mappedBy = "sale",
            cascade = CascadeType.ALL
    )
    private List<SaleItem> items = new ArrayList<>();
}