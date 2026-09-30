package com.projectpos.activityservice.activity.controller;

import com.projectpos.activityservice.activity.entity.ActivityEvent;
import com.projectpos.activityservice.activity.service.ActivityService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.json.JsonMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ActivityEventController.class)
@ActiveProfiles("test")
class ActivityEventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JsonMapper jsonMapper;

    /*
     * Le vrai ActivityService n'est pas chargé.
     *
     * On teste ici uniquement la couche HTTP :
     * - routes
     * - JSON
     * - validation
     * - codes HTTP
     *
     * MongoDB n'est donc pas nécessaire pour ces tests.
     */
    @MockitoBean
    private ActivityService activityService;


    /*
     * TEST 1
     *
     * Un événement valide doit être accepté
     * et retourner HTTP 201 Created.
     */
    @Test
    void shouldCreateActivityEvent() throws Exception {

        ActivityEvent savedEvent = ActivityEvent.builder()
                .id("event-1")
                .eventType("PRICE_CHANGED")
                .occurredAt(LocalDateTime.now())
                .userId(1)
                .sourceService("product-service")
                .entityType("PRODUCT")
                .entityId("7")
                .metadata(
                        Map.of(
                                "oldSalePrice", 25000,
                                "newSalePrice", 28000
                        )
                )
                .build();

        when(activityService.create(any()))
                .thenReturn(savedEvent);

        Map<String, Object> request = Map.of(
                "eventType", "PRICE_CHANGED",
                "userId", 1,
                "sourceService", "product-service",
                "entityType", "PRODUCT",
                "entityId", "7",
                "metadata", Map.of(
                        "oldSalePrice", 25000,
                        "newSalePrice", 28000
                )
        );

        mockMvc.perform(
                        post("/api/v1/activities")
                                .contentType("application/json")
                                .content(jsonMapper.writeValueAsString(request))
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("event-1"))
                .andExpect(jsonPath("$.eventType").value("PRICE_CHANGED"))
                .andExpect(jsonPath("$.sourceService").value("product-service"))
                .andExpect(jsonPath("$.entityType").value("PRODUCT"))
                .andExpect(jsonPath("$.entityId").value("7"));
    }


    /*
     * TEST 2
     *
     * Les champs @NotBlank du DTO sont volontairement vides.
     *
     * Spring doit bloquer la requête AVANT l'appel au service
     * et retourner HTTP 400 Bad Request.
     */
    @Test
    void shouldRejectInvalidActivityEvent() throws Exception {

        Map<String, Object> request = Map.of(
                "eventType", "",
                "sourceService", "",
                "entityType", "PRODUCT",
                "entityId", "",
                "metadata", Map.of("test", true)
        );

        mockMvc.perform(
                        post("/api/v1/activities")
                                .contentType("application/json")
                                .content(jsonMapper.writeValueAsString(request))
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Validation failed"))
                .andExpect(jsonPath("$.validationErrors.eventType").exists())
                .andExpect(jsonPath("$.validationErrors.sourceService").exists())
                .andExpect(jsonPath("$.validationErrors.entityId").exists());
    }


    /*
     * TEST 3
     *
     * Vérifie la consultation des événements
     * filtrés par type.
     */
    @Test
    void shouldFindActivitiesByEventType() throws Exception {

        ActivityEvent event = ActivityEvent.builder()
                .id("event-1")
                .eventType("PRICE_CHANGED")
                .occurredAt(LocalDateTime.now())
                .sourceService("product-service")
                .entityType("PRODUCT")
                .entityId("7")
                .metadata(Map.of())
                .build();

        when(activityService.findByEventType("PRICE_CHANGED"))
                .thenReturn(List.of(event));

        mockMvc.perform(
                        get("/api/v1/activities/type/PRICE_CHANGED")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].eventType")
                        .value("PRICE_CHANGED"))
                .andExpect(jsonPath("$[0].entityId")
                        .value("7"));

        verify(activityService)
                .findByEventType("PRICE_CHANGED");
    }


    /*
     * TEST 4
     *
     * Vérifie la consultation des événements
     * concernant une entité précise.
     *
     * Exemple :
     * toutes les activités du produit 7.
     */
    @Test
    void shouldFindActivitiesByEntity() throws Exception {

        ActivityEvent event = ActivityEvent.builder()
                .id("event-1")
                .eventType("PRICE_CHANGED")
                .occurredAt(LocalDateTime.now())
                .sourceService("product-service")
                .entityType("PRODUCT")
                .entityId("7")
                .metadata(Map.of())
                .build();

        when(activityService.findByEntity("PRODUCT", "7"))
                .thenReturn(List.of(event));

        mockMvc.perform(
                        get("/api/v1/activities/entity/PRODUCT/7")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].entityType")
                        .value("PRODUCT"))
                .andExpect(jsonPath("$[0].entityId")
                        .value("7"))
                .andExpect(jsonPath("$[0].eventType")
                        .value("PRICE_CHANGED"));

        verify(activityService)
                .findByEntity("PRODUCT", "7");
    }
}