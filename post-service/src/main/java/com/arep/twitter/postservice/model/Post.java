package com.arep.twitter.postservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "posts")
public class Post {
    
    @Id
    private String id;
    
    @NotBlank(message = "User ID is required")
    @Indexed
    private String userId;
    
    @NotBlank(message = "Username is required")
    private String username;
    
    @NotBlank(message = "Content is required")
    @Size(max = 140, message = "Post content must not exceed 140 characters")
    private String content;
    
    private List<String> likes = new ArrayList<>();
    
    private int likesCount = 0;
    
    private int repostsCount = 0;
    
    private List<Comment> comments = new ArrayList<>();
    
    private int commentsCount = 0;
    
    @Indexed
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
