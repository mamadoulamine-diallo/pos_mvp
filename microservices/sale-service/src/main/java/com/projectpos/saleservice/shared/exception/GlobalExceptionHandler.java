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

    @ExceptionHandler(FeignException.BadRequest.class)
    public ResponseEntity<Map<String, String>> handleFeignBadRequest(
            FeignException.BadRequest exception
    ) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "error",
                        "Opération impossible sur le produit"
                ));
    }
}