package com.myapp.job_application_tracker.exception;

public class GeminiResponseError extends RuntimeException{
    public GeminiResponseError(String message){
        super(message);
    }
}
