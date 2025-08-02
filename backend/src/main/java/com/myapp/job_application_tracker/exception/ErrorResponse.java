package com.myapp.job_application_tracker.exception;

import lombok.*;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {
    private int statusCode;
    private String message;

    public ErrorResponse(String message){
        super();
        this.message = message;
    }
}
