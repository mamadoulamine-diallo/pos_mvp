package com.projectpos.activityservice.activity.service;

import com.projectpos.activityservice.activity.dto.CreateActivityEventRequest;
import com.projectpos.activityservice.activity.entity.ActivityEvent;
import com.projectpos.activityservice.activity.repository.ActivityEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityEventRepository repository;

    public ActivityEvent create(CreateActivityEventRequest request) {

        ActivityEvent event = ActivityEvent.builder()
                .eventType(request.eventType())
                .occurredAt(LocalDateTime.now())
                .userId(request.userId())
                .sourceService(request.sourceService())
                .entityType(request.entityType())
                .entityId(request.entityId())
                .metadata(request.metadata())
                .build();

        return repository.save(event);
    }

    public List<ActivityEvent> findAll() {
        return repository.findAll();
    }

    public List<ActivityEvent> findByEventType(String eventType) {
        return repository.findByEventTypeOrderByOccurredAtDesc(eventType);
    }

    public List<ActivityEvent> findByEntity(String entityType, String entityId) {
        return repository.findByEntityTypeAndEntityIdOrderByOccurredAtDesc(
                entityType,
                entityId
        );
    }
}