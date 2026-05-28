package com.projectpos.sale.controller;

import com.projectpos.sale.service.SaleService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SaleController {

    private final SaleService service;

    public SaleController(SaleService service) {
        this.service = service;
    }

    @GetMapping("/sales")
    public String listSales(Model model) {
        model.addAttribute("sales", service.findAll());

        return "sale/list";
    }
}