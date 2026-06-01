package com.projectpos.dashboard.service;

import com.projectpos.dashboard.dto.DashboardSummary;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DashboardService {

    public DashboardSummary getSummary() {

        return new DashboardSummary(
                BigDecimal.ZERO,
                0L,
                0L,
                BigDecimal.ZERO
        );
    }
}