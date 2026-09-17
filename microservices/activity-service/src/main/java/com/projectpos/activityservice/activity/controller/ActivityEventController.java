package com.projectpos.activityservice.activity.controller;

import com.projectpos.activityservice.activity.dto.CreateActivityEventRequest;
import com.projectpos.activityservice.activity.entity.ActivityEvent;
import com.projectpos.activityservice.activity.service.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activities")
@RequiredArgsConstructor
public class ActivityEventController {

    private final ActivityService activityService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ActivityEvent create(
            @Valid @RequestBody CreateActivityEventRequest request
    ) {
        return activityService.create(request);
    }

    @GetMapping
    public List<ActivityEvent> findAll() {
        return activityService.findAll();
    }

    @GetMapping("/type/{eventType}")
    public List<ActivityEvent> findByEventType(
            @PathVariable String eventType
    ) {
        return activityService.findByEventType(eventType);
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    public List<ActivityEvent> findByEntity(
            @PathVariable String entityType,
            @PathVariable String entityId
    ) {
        return activityService.findByEntity(entityType, entityId);
    }
}