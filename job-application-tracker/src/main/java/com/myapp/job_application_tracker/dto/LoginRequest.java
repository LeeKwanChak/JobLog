package com.myapp.job_application_tracker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "identifier cannot be blank")
    private String identifier;
    @NotBlank(message = "Password cannot be blank")
    private String password;
}
