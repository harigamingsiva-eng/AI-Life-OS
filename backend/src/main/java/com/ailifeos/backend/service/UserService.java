package com.ailifeos.backend.service;


import com.ailifeos.backend.model.User;
import com.ailifeos.backend.repository.UserRepository;
import com.ailifeos.backend.security.JwtUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.*;


@Service
@RequiredArgsConstructor
public class UserService {


    private final UserRepository userRepository;

    private final JwtUtil jwtUtil;



    // REGISTER
    public Map<String,String> register(
            String name,
            String email,
            String password
    ){

        Map<String,String> response = new HashMap<>();


        if(userRepository.findByEmail(email).isPresent()){

            response.put(
                    "error",
                    "Email already exists"
            );

            return response;
        }


        User user = new User();

        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole("USER");


        User savedUser =
                userRepository.save(user);



        response.put(
                "message",
                "Registration successful"
        );


        response.put(
                "userId",
                String.valueOf(savedUser.getId())
        );


        response.put(
                "name",
                savedUser.getName()
        );


        response.put(
                "email",
                savedUser.getEmail()
        );


        return response;

    }




    // LOGIN
    public Map<String,String> login(
            String email,
            String password
    ){

        Map<String,String> response = new HashMap<>();


        User user =
                userRepository
                .findByEmail(email)
                .orElse(null);



        if(user == null ||
                !user.getPassword().equals(password)){


            response.put(
                    "error",
                    "Invalid email or password"
            );


            return response;
        }



        String token =
                jwtUtil.generateToken(user.getEmail());



        response.put(
                "message",
                "Login successful"
        );


        response.put(
                "token",
                token
        );


        response.put(
                "userId",
                String.valueOf(user.getId())
        );


        response.put(
                "name",
                user.getName()
        );


        response.put(
                "email",
                user.getEmail()
        );


        return response;

    }




    public List<User> getAllUsers(){

        return userRepository.findAll();

    }




    public Optional<User> getUserById(Long id){

        return userRepository.findById(id);

    }




    public User createUser(User user){

        return userRepository.save(user);

    }




    public User updateUser(
            Long id,
            User userDetails
    ){

        User user =
                userRepository
                .findById(id)
                .orElseThrow(
                    () -> new RuntimeException("User not found")
                );


        user.setName(userDetails.getName());

        user.setEmail(userDetails.getEmail());

        user.setPassword(userDetails.getPassword());

        user.setRole(userDetails.getRole());


        return userRepository.save(user);

    }




    public void deleteUser(Long id){

        userRepository.deleteById(id);

    }

}