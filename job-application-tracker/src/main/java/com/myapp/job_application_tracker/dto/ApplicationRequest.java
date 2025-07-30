package com.myapp.job_application_tracker.dto;

import com.myapp.job_application_tracker.enums.ApplicationStatus;
import com.myapp.job_application_tracker.model.Application;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;

@Data
public class ApplicationRequest {
    private String url;

    @NotBlank(message= "Company Name cannot be blank")
    private String companyName;

    @NotBlank(message= "Job Title cannot be blank")
    private String jobTitle;

    @NotNull(message = "Apply date cannot be blank")
    private LocalDate applyDate;

    @NotNull(message = "Application Status cannot be blank")
    private ApplicationStatus applicationStatus;

    private String requiredSkills;
}
