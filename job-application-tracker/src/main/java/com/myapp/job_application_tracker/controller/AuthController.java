package com.myapp.job_application_tracker.controller;

import com.myapp.job_application_tracker.dto.SignupRequest;
import com.myapp.job_application_tracker.jwt.JwtUtil;
import com.myapp.job_application_tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.myapp.job_application_tracker.dto.MessageResponse;

import java.util.Map;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserService userService;

    @Autowired
    JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest){
        try{
            userService.registerNewUser(signupRequest.toUser());
            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        }catch (com.myapp.job_application_tracker.exception.UserAlreadyExistsException e){
            throw e;
        }catch (Exception e){
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()))
        }
    }
}
