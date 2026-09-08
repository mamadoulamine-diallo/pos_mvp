package com.projectpos.saleservice.sale.repository;

import com.projectpos.saleservice.sale.entity.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleItemRepository extends JpaRepository<SaleItem, Integer> {
}