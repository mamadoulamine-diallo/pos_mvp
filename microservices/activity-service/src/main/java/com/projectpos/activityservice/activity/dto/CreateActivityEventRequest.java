package com.projectpos.activityservice.activity.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Map;

public record CreateActivityEventRequest(

        @NotBlank
        String eventType,

        Integer userId,

        @NotBlank
        String sourceService,

        @NotBlank
        String entityType,

        @NotBlank
        String entityId,

        Map<String, Object> metadata
) {
}