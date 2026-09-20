package com.ailifeos.backend.controller;

import com.ailifeos.backend.dto.ChatRequest;
import com.ailifeos.backend.dto.ChatResponse;
import com.ailifeos.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173"
})
public class ChatController {

    private final ChatService chatService;


    // SEND MESSAGE TO AI

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {

        String reply = chatService.chat(request.getMessage());

        return new ChatResponse(reply);
    }


    // CLEAR AI CONVERSATION MEMORY

    @DeleteMapping("/clear")
    public ResponseEntity<String> clearChat() {

        chatService.clearMemory();

        return ResponseEntity.ok(
                "Chat memory cleared successfully"
        );
    }

}