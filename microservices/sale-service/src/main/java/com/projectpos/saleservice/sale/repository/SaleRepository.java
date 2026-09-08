package com.projectpos.saleservice.sale.repository;

import com.projectpos.saleservice.sale.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface SaleRepository extends JpaRepository<Sale, Integer> {

    @Query("""
        SELECT DISTINCT s
        FROM Sale s
        LEFT JOIN FETCH s.items
        WHERE s.id = :id
    """)
    Optional<Sale> findByIdWithItems(Integer id);
}