package com.projectpos.dashboard.repository;

import com.projectpos.sale.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;

public interface DashboardRepository extends JpaRepository<Sale, Integer> {

    @Query("""
        SELECT COALESCE(SUM(si.quantity * si.unitPrice), 0)
        FROM SaleItem si
        WHERE si.sale.status = 'VALIDEE'
    """)
    BigDecimal getRevenue();

    @Query("""
        SELECT COUNT(s)
        FROM Sale s
        WHERE s.status = 'VALIDEE'
    """)
    Long getSalesCount();

    @Query("""
        SELECT COALESCE(SUM(si.quantity), 0)
        FROM SaleItem si
        WHERE si.sale.status = 'VALIDEE'
    """)
    Long getItemsSold();
}