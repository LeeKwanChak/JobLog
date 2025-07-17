package com.myapp.job_application_tracker.service;

import com.myapp.job_application_tracker.exception.UserAlreadyExistsException;
import com.myapp.job_application_tracker.model.User;
import com.myapp.job_application_tracker.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

public class UserService {
    private final PasswordEncoder passwordEncoder;
    private UserRepository userRepository;
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerNewUser(User user){
        if(userRepository.existsByUsername(user.getUsername())){
            throw new UserAlreadyExistsException("Username '"+ user.getUsername()+"' already exists.");
        }
        if(userRepository.existsByEmail(user.getEmail())){
            throw new UserAlreadyExistsException("Email '" + user.getEmail()+"' already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

}
