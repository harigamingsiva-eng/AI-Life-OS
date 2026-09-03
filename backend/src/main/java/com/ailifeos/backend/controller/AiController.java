package com.ailifeos.backend.controller;

import com.ailifeos.backend.model.Task;
import com.ailifeos.backend.model.Goal;
import com.ailifeos.backend.model.Expense;

import com.ailifeos.backend.repository.TaskRepository;
import com.ailifeos.backend.repository.GoalRepository;
import com.ailifeos.backend.repository.ExpenseRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AiController {


    private final TaskRepository taskRepository;
    private final GoalRepository goalRepository;
    private final ExpenseRepository expenseRepository;


    @Value("${gemini.api.key:test-key}")
    private String apiKey;



    @PostMapping("/chat")
    public ResponseEntity<?> chat(
            @RequestBody Map<String,String> request
    ){

        try {


            String userMessage = request.get("message");


            if(userMessage == null || userMessage.trim().isEmpty()){

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "error",
                                        "Message cannot be empty"
                                )
                        );
            }



            // Temporary user id
            Long userId = 1L;



            List<Task> tasks =
                    taskRepository.findByUserId(userId);


            List<Goal> goals =
                    goalRepository.findByUserId(userId);


            List<Expense> expenses =
                    expenseRepository.findByUserId(userId);



            StringBuilder userData = new StringBuilder();



            userData.append("TASKS:\n");


            if(tasks.isEmpty()){

                userData.append("No tasks\n");

            }else{

                for(Task task : tasks){

                    userData.append("- ")
                            .append(task.getTitle())
                            .append(" | ")
                            .append(task.getStatus())
                            .append("\n");
                }
            }



            userData.append("\nGOALS:\n");


            if(goals.isEmpty()){

                userData.append("No goals\n");

            }else{

                for(Goal goal : goals){

                    userData.append("- ")
                            .append(goal.getTitle())
                            .append(" | Progress ")
                            .append(goal.getProgress())
                            .append("%\n");
                }
            }



            userData.append("\nEXPENSES:\n");


            if(expenses.isEmpty()){

                userData.append("No expenses\n");

            }else{

                for(Expense expense : expenses){

                    userData.append("- ₹")
                            .append(expense.getAmount())
                            .append(" ")
                            .append(expense.getCategory())
                            .append("\n");
                }
            }




            String prompt = 
                    "You are NEXUS AI Assistant.\n\n" +
                    "You are a productivity coach.\n\n" +
                    "User Data:\n" +
                    userData +
                    "\nUser Question:\n" +
                    userMessage +
                    "\n\nGive simple practical advice.";



           String url =
                        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="
        + apiKey;


            RestTemplate restTemplate =
                    new RestTemplate();



            HttpHeaders headers =
                    new HttpHeaders();

            headers.setContentType(
                    MediaType.APPLICATION_JSON
            );




            Map<String,Object> body =
                    Map.of(

                    "contents",
                    List.of(

                    Map.of(

                    "parts",
                    List.of(

                    Map.of(
                    "text",
                    prompt
                    )

                    )

                    )

                    )

                    );




            HttpEntity<Map<String,Object>> entity =
                    new HttpEntity<>(
                            body,
                            headers
                    );




            ResponseEntity<Map> response =
                    restTemplate.postForEntity(
                            url,
                            entity,
                            Map.class
                    );



            return ResponseEntity.ok(response.getBody());



        }
        catch(Exception e){


            e.printStackTrace();


            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );

        }

    }

}