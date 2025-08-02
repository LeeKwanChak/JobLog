package com.myapp.job_application_tracker.exception;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NotFoundException extends RuntimeException{
    public NotFoundException(String message){
        super(message);
    }

    public NotFoundException(String resourceName, Long id){
        super(String.format("%s with ID %d not found", resourceName,id ));
    }
}
