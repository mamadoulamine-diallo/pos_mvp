package com.projectpos.dashboard.repository;

import com.projectpos.sale.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DashboardRepository extends JpaRepository<Sale, Integer> {

    @Query("""
        SELECT COUNT(s)
        FROM Sale s
        WHERE s.status = 'VALIDEE'
    """)
    Long countValidatedSales();
}