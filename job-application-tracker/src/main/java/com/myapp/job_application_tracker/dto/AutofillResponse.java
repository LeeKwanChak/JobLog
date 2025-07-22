package com.myapp.job_application_tracker.dto;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.myapp.job_application_tracker.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AutofillResponse {
    private String companyName;
    private String jobTitle;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate applyDate;
    private String requiredSkills;
    private ApplicationStatus applicationStatus;
}
