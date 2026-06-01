package com.projectpos.dashboard.repository;

import com.projectpos.sale.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.projectpos.dashboard.dto.TopProductDto;
import java.util.List;
import com.projectpos.dashboard.dto.RevenuePointDto;

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

    @Query("""
    SELECT new com.projectpos.dashboard.dto.TopProductDto(
        si.product.name,
        SUM(si.quantity),
        SUM(si.quantity * si.unitPrice)
    )
    FROM SaleItem si
    WHERE si.sale.status = 'VALIDEE'
    GROUP BY si.product.id, si.product.name
    ORDER BY SUM(si.quantity) DESC
""")
    List<TopProductDto> findTopProducts();

    @Query(value = """
    SELECT 
        DATE_FORMAT(s.sale_date, '%Y-%m-%d') AS label,
        SUM(si.quantity * si.unit_price) AS revenue
    FROM sale_item si
    JOIN sale s ON s.id_sale = si.id_sale
    WHERE s.status = 'VALIDEE'
    GROUP BY DATE_FORMAT(s.sale_date, '%Y-%m-%d')
    ORDER BY DATE_FORMAT(s.sale_date, '%Y-%m-%d')
""", nativeQuery = true)
    List<Object[]> findRevenueByDayRaw();
}