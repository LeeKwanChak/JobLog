package com.myapp.job_application_tracker.controller;

import com.myapp.job_application_tracker.model.User;
import com.myapp.job_application_tracker.service.UserDetailsImpl;
import com.myapp.job_application_tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class UserInfoController {
    @Autowired
    UserService userService;

    @Autowired
    public UserInfoController(UserService userService){
        this.userService = userService;
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
}
