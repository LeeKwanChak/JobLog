package com.myapp.job_application_tracker.controller;

import com.myapp.job_application_tracker.dto.UserInfoUpdateRequest;
import com.myapp.job_application_tracker.model.User;
import com.myapp.job_application_tracker.service.UserDetailsImpl;
import com.myapp.job_application_tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
public class UserInfoController {
    @Autowired
    UserService userService;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserInfoController(UserService userService, PasswordEncoder passwordEncoder){
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }



    private Long getCurrentUserId(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }

    @GetMapping("/userinfo")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> getUserInfo(){
        Long currentUserId = getCurrentUserId();
        User user = userService.getUserInfo(currentUserId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/updateuser")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateUserInfo(@RequestBody UserInfoUpdateRequest userInfoUpdateRequest){
        Long currentUserId = getCurrentUserId();
        User user = userService.getUserById(currentUserId);
        if(userService.ifExistsUsername(userInfoUpdateRequest.getUsername())){
            return ResponseEntity.badRequest().body("Username is already taken");
        }
        user.setUsername(userInfoUpdateRequest.getUsername());
        user.setPassword(passwordEncoder.encode(userInfoUpdateRequest.getPassword()));
        userService.saveUser(user);

        return ResponseEntity.ok(user);
    }
}
