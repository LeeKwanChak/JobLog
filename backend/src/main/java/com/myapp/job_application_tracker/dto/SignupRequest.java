package com.myapp.job_application_tracker.dto;

import com.myapp.job_application_tracker.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import jakarta.validation.constraints.Pattern;

@Data
public class SignupRequest {
    @NotBlank
    @Pattern(regexp = "^[^@]+$", message = "Username cannot contain '@' symbol")
    private String username;

    @NotBlank(message = "Email cannot be blank")
    @Email@Email(message = "Invalid email format")
    private String email;

    @NotBlank@NotBlank(message = "Password cannot be blank")
    @Size(min = 6, max = 40)
    private String password;

    public User toUser(){
        return new User(this.username, this.email, this.password);
    }
}
