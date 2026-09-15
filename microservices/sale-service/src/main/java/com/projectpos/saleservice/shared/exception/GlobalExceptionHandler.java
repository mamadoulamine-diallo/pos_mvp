package com.projectpos.saleservice.shared.exception;

import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(FeignException.Unauthorized.class)
    public ResponseEntity<Map<String, String>> handleUnauthorized(
            FeignException.Unauthorized exception
    ) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "error",
                        "Session invalide ou expirée"
                ));
    }
}