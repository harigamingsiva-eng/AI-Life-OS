package com.ailifeos.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatService {

    private static final String LM_STUDIO_URL =
            "http://localhost:1234/v1/chat/completions";

    private final RestTemplate restTemplate = new RestTemplate();

    public String chat(String message) {

        try {

            Map<String, Object> request = new HashMap<>();

            request.put("model", "llama-3.2-3b-instruct");

request.put("messages", List.of(
        Map.of(
                "role", "system",
                "content",
                "You are NEXUS AI. Give short, direct and helpful answers. " +
                "For simple greetings, reply in one short sentence. " +
                "Help with productivity, tasks, goals, expenses and study."
        ),
        Map.of(
                "role", "user",
                "content", message
        )
));

request.put("temperature", 0.2);
request.put("max_tokens", 30);
request.put("stream", false);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(request, headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(
                            LM_STUDIO_URL,
                            entity,
                            String.class
                    );

            ObjectMapper mapper = new ObjectMapper();

            JsonNode json =
                    mapper.readTree(response.getBody());

            return json
                    .get("choices")
                    .get(0)
                    .get("message")
                    .get("content")
                    .asText();

        } catch (Exception e) {

            e.printStackTrace();

            return "Sorry, AI service is currently unavailable.";

        }

    }
}