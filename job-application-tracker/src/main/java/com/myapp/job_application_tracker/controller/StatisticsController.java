package com.myapp.job_application_tracker.controller;

import com.myapp.job_application_tracker.service.StatisticService;
import com.myapp.job_application_tracker.service.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stat")
public class StatisticsController {
    private final StatisticService statisticService;

    public StatisticsController(StatisticService statisticService){
        this.statisticService = statisticService;
    }

    private Long getCurrentUserId(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }

    @GetMapping("/total")
    public ResponseEntity<Integer> getTotalNumber(){
        Long currentUserId = getCurrentUserId();
        int total = statisticService.findTotalNumber(currentUserId);
        return ResponseEntity.ok(total);
    }

}
