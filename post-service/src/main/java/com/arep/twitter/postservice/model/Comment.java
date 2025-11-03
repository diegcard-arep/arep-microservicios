package com.arep.twitter.postservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    
    @Id
    private String id;
    
    @NotBlank(message = "User ID is required")
    private String userId;
    
    @NotBlank(message = "Username is required")
    private String username;
    
    @NotBlank(message = "Content is required")
    @Size(max = 280, message = "Comment content must not exceed 280 characters")
    private String content;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
