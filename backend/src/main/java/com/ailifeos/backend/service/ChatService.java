package com.ailifeos.backend.service;

import com.ailifeos.backend.model.ChatMessage;
import com.ailifeos.backend.repository.ChatMessageRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatService {

    private static final String OLLAMA_URL =
            "http://localhost:11434/api/chat";

    private final ChatMessageRepository chatMessageRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    // Temporary conversation memory
    private final List<Map<String, String>> conversationHistory =
            new ArrayList<>();


    public String chat(String message) {

        try {

            List<Map<String, String>> messages =
                    new ArrayList<>();


            // SYSTEM MESSAGE

            messages.add(Map.of(
                    "role", "system",
                    "content",
                    "You are NEXUS AI, a friendly and intelligent AI assistant. " +
                    "You can have normal conversations and also help with productivity, " +
                    "tasks, goals, expenses, study, planning and personal improvement. " +
                    "Remember the context of the current conversation. " +
                    "Give helpful, natural and concise answers."
            ));


            // ADD PREVIOUS CONVERSATION

            messages.addAll(conversationHistory);


            // ADD CURRENT USER MESSAGE

            Map<String, String> userMessage = Map.of(
                    "role", "user",
                    "content", message
            );

            messages.add(userMessage);


            // OLLAMA REQUEST

            Map<String, Object> request = new HashMap<>();

            request.put("model", "llama3.2");
            request.put("messages", messages);
            request.put("stream", false);

            request.put("options", Map.of(
                    "temperature", 0.7,
                    "num_predict", 150
            ));


            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(MediaType.APPLICATION_JSON);


            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(request, headers);


            ResponseEntity<String> response =
                    restTemplate.postForEntity(
                            OLLAMA_URL,
                            entity,
                            String.class
                    );


            ObjectMapper mapper = new ObjectMapper();

            JsonNode json =
                    mapper.readTree(response.getBody());


            String aiResponse =
                    json
                            .get("message")
                            .get("content")
                            .asText();


            // SAVE USER MESSAGE IN MEMORY

            conversationHistory.add(userMessage);


            // SAVE AI RESPONSE IN MEMORY

            conversationHistory.add(
                    Map.of(
                            "role", "assistant",
                            "content", aiResponse
                    )
            );


            // LIMIT MEMORY TO LAST 20 MESSAGES

            if (conversationHistory.size() > 20) {

                conversationHistory.subList(
                        0,
                        conversationHistory.size() - 20
                ).clear();

            }


            // SAVE USER MESSAGE TO DATABASE

            ChatMessage userChatMessage =
                    ChatMessage.builder()
                            .userId(1L)
                            .role("user")
                            .message(message)
                            .createdAt(LocalDateTime.now())
                            .build();

            chatMessageRepository.save(userChatMessage);


            // SAVE AI MESSAGE TO DATABASE

            ChatMessage aiChatMessage =
                    ChatMessage.builder()
                            .userId(1L)
                            .role("assistant")
                            .message(aiResponse)
                            .createdAt(LocalDateTime.now())
                            .build();

            chatMessageRepository.save(aiChatMessage);


            return aiResponse;


        } catch (Exception e) {

            e.printStackTrace();

            return "Sorry, AI service is currently unavailable.";

        }

    }


    // CLEAR CHAT MEMORY

    public void clearMemory() {

        conversationHistory.clear();

    }

}