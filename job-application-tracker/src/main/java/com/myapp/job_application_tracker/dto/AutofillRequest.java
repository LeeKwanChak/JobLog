package com.myapp.job_application_tracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AutofillRequest {
    @NotBlank(message = "URL cannot ba empty")
    private String url;

    @NotNull
    private Long userId;
}
