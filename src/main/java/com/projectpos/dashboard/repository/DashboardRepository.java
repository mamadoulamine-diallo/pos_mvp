package com.projectpos.dashboard.repository;

import com.projectpos.dashboard.dto.*;
import com.projectpos.sale.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface DashboardRepository extends JpaRepository<Sale, Integer> {

    @Query("""
        SELECT COALESCE(SUM(si.quantity * si.unitPrice), 0)
        FROM SaleItem si
        WHERE si.sale.status = 'VALIDEE'
        AND si.sale.saleDate >= :startDate
    """)
    BigDecimal getRevenue(@Param("startDate") LocalDateTime startDate);

    @Query("""
        SELECT COUNT(s)
        FROM Sale s
        WHERE s.status = 'VALIDEE'
        AND s.saleDate >= :startDate
    """)
    Long getSalesCount(@Param("startDate") LocalDateTime startDate);

    @Query("""
        SELECT COALESCE(SUM(si.quantity), 0)
        FROM SaleItem si
        WHERE si.sale.status = 'VALIDEE'
        AND si.sale.saleDate >= :startDate
    """)
    Long getItemsSold(@Param("startDate") LocalDateTime startDate);

    @Query(value = """
        SELECT
            CASE :period
                WHEN 'DAY' THEN DATE_FORMAT(s.sale_date, '%Y-%m-%d')
                WHEN 'MONTH' THEN DATE_FORMAT(s.sale_date, '%Y-%m')
                WHEN 'YEAR' THEN YEAR(s.sale_date)
            END AS label,
            SUM(si.quantity * si.unit_price) AS revenue
        FROM sale_item si
        JOIN sale s ON s.id_sale = si.id_sale
        WHERE s.status = 'VALIDEE'
        AND s.sale_date >= :startDate
        GROUP BY label
        ORDER BY label
    """, nativeQuery = true)
    List<Object[]> findRevenueByPeriodRaw(@Param("startDate") LocalDateTime startDate,
                                          @Param("period") String period);

    default List<Object[]> findRevenueByDayRaw(LocalDateTime startDate) {
        return findRevenueByPeriodRaw(startDate, "DAY");
    }

    default List<Object[]> findRevenueByMonthRaw(LocalDateTime startDate) {
        return findRevenueByPeriodRaw(startDate, "MONTH");
    }

    default List<Object[]> findRevenueByYearRaw(LocalDateTime startDate) {
        return findRevenueByPeriodRaw(startDate, "YEAR");
    }

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
    List<TopProductDto> findTopProducts(@Param("startDate") LocalDateTime startDate);

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
    List<RecentSaleDto> findRecentSales(@Param("startDate") LocalDateTime startDate);
}