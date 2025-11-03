package com.arep.twitter.streamservice.controller;

import com.arep.twitter.streamservice.dto.TimelineDTO;
import com.arep.twitter.streamservice.service.StreamService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/timeline")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "https://d84l1y8p4kdic.cloudfront.net"})
public class StreamController {
    
    private final StreamService streamService;
    
    @GetMapping("/global")
    public ResponseEntity<TimelineDTO> getGlobalTimeline(
            @RequestParam String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        TimelineDTO timeline = streamService.getGlobalTimeline(userId, page, size, token);
        return ResponseEntity.ok(timeline);
    }
    
    @GetMapping("/personal")
    public ResponseEntity<TimelineDTO> getPersonalTimeline(
            @RequestParam String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        TimelineDTO timeline = streamService.getPersonalTimeline(userId, page, size, token);
        return ResponseEntity.ok(timeline);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<TimelineDTO> getUserTimeline(
            @PathVariable String userId,
            @RequestParam String currentUserId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        TimelineDTO timeline = streamService.getUserTimeline(userId, currentUserId, page, size, token);
        return ResponseEntity.ok(timeline);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "stream-service"));
    }
}
