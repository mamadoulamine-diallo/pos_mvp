package com.projectpos.activityservice.activity.repository;

import com.projectpos.activityservice.activity.entity.ActivityEvent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ActivityEventRepository
        extends MongoRepository<ActivityEvent, String> {

    List<ActivityEvent> findByEventTypeOrderByOccurredAtDesc(String eventType);

    List<ActivityEvent> findByEntityTypeAndEntityIdOrderByOccurredAtDesc(
            String entityType,
            String entityId
    );
}