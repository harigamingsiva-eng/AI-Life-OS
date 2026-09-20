package com.ailifeos.backend.controller;

import com.ailifeos.backend.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/{userId}")
    public Map<String, Object> getRecommendations(
            @PathVariable Long userId) {

        List<String> recommendations =
                recommendationService.generateRecommendations(userId);

        return Map.of(
                "recommendations", recommendations
        );
    }
}