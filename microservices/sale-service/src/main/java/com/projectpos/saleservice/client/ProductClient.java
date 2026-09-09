package com.projectpos.saleservice.client;

import com.projectpos.saleservice.client.dto.ProductResponse;
import com.projectpos.saleservice.client.dto.RemoveStockRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "product-service")
public interface ProductClient {

    @GetMapping("/api/v1/products/{id}")
    ProductResponse findById(@PathVariable("id") Integer id);

    @PostMapping("/api/v1/products/stock/remove")
    void removeStock(@RequestBody RemoveStockRequest request);
}