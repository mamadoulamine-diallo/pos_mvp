package com.projectpos.activityservice.activity.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "activity_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityEvent {

    @Id
    private String id;

    private String eventType;

    private LocalDateTime occurredAt;

    private Integer userId;

    private String sourceService;

    private String entityType;

    private String entityId;

    private Map<String, Object> metadata;
}