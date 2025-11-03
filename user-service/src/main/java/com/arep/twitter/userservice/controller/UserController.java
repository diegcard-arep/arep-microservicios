package com.arep.twitter.userservice.controller;

import com.arep.twitter.userservice.dto.UserDTO;
import com.arep.twitter.userservice.dto.UserResponseDTO;
import com.arep.twitter.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "https://d84l1y8p4kdic.cloudfront.net"})
public class UserController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(
            @Valid @RequestBody UserDTO userDTO,
            Authentication authentication) {
        
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String cognitoSub = jwt.getSubject();
        
        log.info("Registering user: {} with cognito sub: {}", userDTO.getUsername(), cognitoSub);
        
        UserResponseDTO user = userService.createUser(userDTO, cognitoSub);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String cognitoSub = jwt.getSubject();
        
        log.info("Getting current user with cognito sub: {}", cognitoSub);
        
        try {
            UserResponseDTO user = userService.getUserByCognitoSub(cognitoSub);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            log.warn("User not found for cognito sub: {}", cognitoSub);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable String id) {
        UserResponseDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponseDTO> getUserByUsername(@PathVariable String username) {
        UserResponseDTO user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<UserResponseDTO>> searchUsers(@RequestParam String query) {
        List<UserResponseDTO> users = userService.searchUsers(query);
        return ResponseEntity.ok(users);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable String id,
            @Valid @RequestBody UserDTO userDTO,
            Authentication authentication) {
        
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String cognitoSub = jwt.getSubject();
        
        UserResponseDTO currentUser = userService.getUserByCognitoSub(cognitoSub);
        
        if (!currentUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        UserResponseDTO updatedUser = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(updatedUser);
    }
    
    @PostMapping("/{id}/follow")
    public ResponseEntity<Map<String, String>> followUser(
            @PathVariable String id,
            Authentication authentication) {
        
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String cognitoSub = jwt.getSubject();
        
        UserResponseDTO currentUser = userService.getUserByCognitoSub(cognitoSub);
        
        userService.followUser(currentUser.getId(), id);
        return ResponseEntity.ok(Map.of("message", "User followed successfully"));
    }
    
    @PostMapping("/{id}/unfollow")
    public ResponseEntity<Map<String, String>> unfollowUser(
            @PathVariable String id,
            Authentication authentication) {
        
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String cognitoSub = jwt.getSubject();
        
        UserResponseDTO currentUser = userService.getUserByCognitoSub(cognitoSub);
        
        userService.unfollowUser(currentUser.getId(), id);
        return ResponseEntity.ok(Map.of("message", "User unfollowed successfully"));
    }
    
    @GetMapping("/cognito/{cognitoSub}")
    public ResponseEntity<UserResponseDTO> getUserByCognitoSub(@PathVariable String cognitoSub) {
        log.info("Getting user by cognito sub: {}", cognitoSub);
        
        try {
            UserResponseDTO user = userService.getUserByCognitoSub(cognitoSub);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            log.error("User not found with cognito sub: {}", cognitoSub);
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "user-service"));
    }
}
