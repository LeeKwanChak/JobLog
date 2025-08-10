package com.myapp.job_application_tracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserInfoUpdateRequest {
    @NotBlank
    @Pattern(regexp = "^[^@]+$", message = "Username cannot contain '@' symbol")
    private String username;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
}
