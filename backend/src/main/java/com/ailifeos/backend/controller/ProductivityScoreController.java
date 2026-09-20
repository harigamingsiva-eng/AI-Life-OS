package com.ailifeos.backend.controller;

import com.ailifeos.backend.service.ProductivityScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/productivity")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173"
})
public class ProductivityScoreController {

    private final ProductivityScoreService productivityScoreService;

    @GetMapping("/score/{userId}")
    public Map<String, Object> getProductivityScore(
            @PathVariable Long userId) {

        int score =
                productivityScoreService.calculateScore(userId);

        return Map.of(
                "score", score
        );
    }
}