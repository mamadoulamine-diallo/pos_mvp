package com.projectpos.sale.repository;

import com.projectpos.sale.dto.SaleHistoryDto;
import com.projectpos.sale.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Integer> {

    @Query("""
    SELECT new com.projectpos.sale.dto.SaleHistoryDto(
        s.id,
        s.saleDate,
        s.user.role,
        SUM(si.quantity),
        SUM(si.quantity * si.unitPrice)
    )
    FROM Sale s
    JOIN s.items si
    GROUP BY
        s.id,
        s.saleDate,
        s.user.role
    ORDER BY s.saleDate DESC
""")
    List<SaleHistoryDto> findSaleHistory();
}