package com.arep.twitter.postservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Health Check Controller - Endpoint público para verificar que Lambda funciona
 * No requiere autenticación
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public Map<String, Object> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("service", "post-service");
        response.put("version", "1.0.0");
        response.put("timestamp", Instant.now().toString());
        response.put("message", "🚀 Lambda está funcionando correctamente!");
        response.put("environment", System.getenv("SPRING_PROFILES_ACTIVE"));
        
        return response;
    }
    
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}
