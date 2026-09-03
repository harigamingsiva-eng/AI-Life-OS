package com.ailifeos.backend.controller;


import com.ailifeos.backend.model.User;
import com.ailifeos.backend.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class UserController {


    private final UserService userService;



    @GetMapping
    public ResponseEntity<List<User>> getUsers(){

        return ResponseEntity.ok(
                userService.getAllUsers()
        );

    }



    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(
            @PathVariable Long id
    ){

        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());

    }



    @PostMapping
    public ResponseEntity<User> create(
            @RequestBody User user
    ){

        return ResponseEntity.ok(
                userService.createUser(user)
        );

    }



    @PutMapping("/{id}")
    public ResponseEntity<User> update(
            @PathVariable Long id,
            @RequestBody User user
    ){

        return ResponseEntity.ok(
                userService.updateUser(id,user)
        );

    }



    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable Long id
    ){

        userService.deleteUser(id);

        return ResponseEntity.ok(
                "User deleted"
        );

    }


}