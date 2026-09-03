package com.ailifeos.backend.controller;

import com.ailifeos.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AuthController {


    private final UserService userService;


    @PostMapping("/register")
public ResponseEntity<?> register(
        @RequestBody Map<String,String> request
){

    try {

        return ResponseEntity.ok(
                userService.register(
                        request.get("name"),
                        request.get("email"),
                        request.get("password")
                )
        );

    } catch(Exception e){

        e.printStackTrace();

        return ResponseEntity
                .status(500)
                .body(
                    Map.of(
                        "error",
                        e.getMessage()
                    )
                );
    }

}



    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String,String> request
    ){

        return ResponseEntity.ok(
                userService.login(
                        request.get("email"),
                        request.get("password")
                )
        );

    }

}