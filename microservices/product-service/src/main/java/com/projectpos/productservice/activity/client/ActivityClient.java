package com.projectpos.productservice.activity.client;

import com.projectpos.productservice.activity.dto.CreateActivityEventRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "activity-service")
public interface ActivityClient {

    @PostMapping("/api/v1/activities")
    void create(@RequestBody CreateActivityEventRequest request);
}