package com.myapp.job_application_tracker.dto;

import com.myapp.job_application_tracker.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    private String username;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    public User toUser(){
        return new User(this.username, this.email, this.password);
    }
}
