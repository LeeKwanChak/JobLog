package com.myapp.job_application_tracker.exception;

public class GeminiResponseException extends RuntimeException{
    public GeminiResponseException(String message){
        super(message);
    }
}
