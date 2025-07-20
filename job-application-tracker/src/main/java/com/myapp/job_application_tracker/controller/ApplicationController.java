package com.myapp.job_application_tracker.controller;

import com.myapp.job_application_tracker.dto.ApplicationRequest;
import com.myapp.job_application_tracker.exception.NotFoundException;
import com.myapp.job_application_tracker.model.Application;
import com.myapp.job_application_tracker.model.User;
import com.myapp.job_application_tracker.repository.UserRepository;
import com.myapp.job_application_tracker.service.ApplicationService;
import com.myapp.job_application_tracker.service.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
    private final ApplicationService applicationService;
    private final UserRepository userRepository;

    @Autowired
    public ApplicationController(ApplicationService applicationService, UserRepository userRepository){
        this.applicationService = applicationService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Application> createApplication(@Valid @RequestBody ApplicationRequest applicationRequest){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long currentUserId = userDetails.getId();
        User currentUser = userRepository.findById(currentUserId).orElseThrow(() -> new NotFoundException("User ID not found"));

        Application application = new Application();
        application.setCompanyName(applicationRequest.getCompanyName());
        application.setJobTitle(applicationRequest.getJobTitle());
        application.setApplyDate(applicationRequest.getApplyDate());
        application.setApplicationStatus(applicationRequest.getApplicationStatus());
        application.setRequiredSkills(applicationRequest.getRequiredSkills());

        application.setUser(currentUser);
        Application saveApplication = applicationService.saveApplication(application);
        return ResponseEntity.status(HttpStatus.CREATED).body(saveApplication);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Application>> getAllApplicationsForCurrentUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long currentUserId = userDetails.getId();
        List<Application> applications = applicationService.getAllApplicationsByUserId(currentUserId);
        return ResponseEntity.ok(applications);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Application> updateApplication(@PathVariable Long id, @Valid @RequestBody ApplicationRequest applicationRequest){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long currentUserId = userDetails.getId();

        Application application = applicationService.getApplicationById(id);
        if(!application.getUser().getId().equals(currentUserId)){
            throw new AccessDeniedException("You are not authorized to update this application.");
        }
        application.setCompanyName(applicationRequest.getCompanyName());
        application.setJobTitle(applicationRequest.getJobTitle());
        application.setApplyDate(applicationRequest.getApplyDate());
        application.setApplicationStatus(applicationRequest.getApplicationStatus());
        application.setRequiredSkills(applicationRequest.getRequiredSkills());
        Application updatedApplication = applicationService.saveApplication(application);
        return ResponseEntity.ok(updatedApplication);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long currentUserId = userDetails.getId();

        Application application = applicationService.getApplicationById(id);
        if(!application.getUser().getId().equals(currentUserId)){
            throw new AccessDeniedException("You are not authorized to delete this application.");
        }
        applicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }
}
