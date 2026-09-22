package com.projectpos.productservice.activity.dto;

import java.util.Map;

public record CreateActivityEventRequest(
        String eventType,
        Integer userId,
        String sourceService,
        String entityType,
        String entityId,
        Map<String, Object> metadata
) {
}