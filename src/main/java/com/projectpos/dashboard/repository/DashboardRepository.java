package com.projectpos.dashboard.repository;

import com.projectpos.dashboard.dto.RecentSaleDto;
import com.projectpos.dashboard.dto.StockAlertDto;
import com.projectpos.sale.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.projectpos.dashboard.dto.TopProductDto;

import java.time.LocalDateTime;
import java.util.List;
import com.projectpos.dashboard.dto.RevenuePointDto;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface DashboardRepository extends JpaRepository<Sale, Integer> {

    @Query("""
    SELECT COALESCE(SUM(si.quantity * si.unitPrice), 0)
    FROM SaleItem si
    WHERE si.sale.status = 'VALIDEE'
    AND si.sale.saleDate >= :startDate
""")
    BigDecimal getRevenue(LocalDateTime startDate);

    @Query("""
    SELECT COUNT(s)
    FROM Sale s
    WHERE s.status = 'VALIDEE'
    AND s.saleDate >= :startDate
""")
    Long getSalesCount(LocalDateTime startDate);

    @Query("""
    SELECT COALESCE(SUM(si.quantity), 0)
    FROM SaleItem si
    WHERE si.sale.status = 'VALIDEE'
    AND si.sale.saleDate >= :startDate
""")
    Long getItemsSold(LocalDateTime startDate);

    @Query(value = """
    SELECT
        YEAR(s.sale_date) as label,
        SUM(si.quantity * si.unit_price) as revenue
    FROM sale_item si
    JOIN sale s ON s.id_sale = si.id_sale
    WHERE s.status = 'VALIDEE'
    AND s.sale_date >= :startDate
    GROUP BY YEAR(s.sale_date)
    ORDER BY YEAR(s.sale_date)
""", nativeQuery = true)
    List<Object[]> findRevenueByYearRaw(@Param("startDate") LocalDateTime startDate);

    @Query(value = """
    SELECT
        DATE_FORMAT(s.sale_date, '%Y-%m') AS label,
        SUM(si.quantity * si.unit_price) AS revenue
    FROM sale_item si
    JOIN sale s ON s.id_sale = si.id_sale
    WHERE s.status = 'VALIDEE'
    AND s.sale_date >= :startDate
    GROUP BY DATE_FORMAT(s.sale_date, '%Y-%m')
    ORDER BY DATE_FORMAT(s.sale_date, '%Y-%m')
""", nativeQuery = true)
    List<Object[]> findRevenueByMonthRaw(@Param("startDate") LocalDateTime startDate);

    @Query("""
    SELECT new com.projectpos.dashboard.dto.StockAlertDto(
        p.id,
        p.name,
        p.stockQuantity,
        CASE
            WHEN p.stockQuantity = 0 THEN 'RUPTURE'
            ELSE 'FAIBLE'
        END
    )
    FROM Product p
    WHERE p.active = true
    AND p.stockQuantity <= 5
    ORDER BY p.stockQuantity ASC
""")
    List<StockAlertDto> findStockAlerts();

    @Query("""
    SELECT new com.projectpos.dashboard.dto.TopProductDto(
        si.product.name,
        SUM(si.quantity),
        SUM(si.quantity * si.unitPrice)
    )
    FROM SaleItem si
    WHERE si.sale.status = 'VALIDEE'
    AND si.sale.saleDate >= :startDate
    GROUP BY si.product.id, si.product.name
    ORDER BY SUM(si.quantity) DESC
""")
    List<TopProductDto> findTopProducts(LocalDateTime startDate);

    @Query("""
    SELECT new com.projectpos.dashboard.dto.RecentSaleDto(
        s.id,
        s.saleDate,
        SUM(si.quantity * si.unitPrice)
    )
    FROM Sale s
    JOIN s.items si
    WHERE s.status = 'VALIDEE'
    AND s.saleDate >= :startDate
    GROUP BY s.id, s.saleDate
    ORDER BY s.saleDate DESC
""")
    List<RecentSaleDto> findRecentSales(LocalDateTime startDate);

    @Query(value = """
    SELECT 
        DATE_FORMAT(s.sale_date, '%Y-%m-%d') AS label,
        SUM(si.quantity * si.unit_price) AS revenue
    FROM sale_item si
    JOIN sale s ON s.id_sale = si.id_sale
    WHERE s.status = 'VALIDEE'
    AND s.sale_date >= :startDate
    GROUP BY DATE_FORMAT(s.sale_date, '%Y-%m-%d')
    ORDER BY DATE_FORMAT(s.sale_date, '%Y-%m-%d')
""", nativeQuery = true)
    List<Object[]> findRevenueByDayRaw(@Param("startDate") LocalDateTime startDate);
}