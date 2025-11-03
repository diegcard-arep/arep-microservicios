package com.arep.twitter.postservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostResponseDTO {
    
    private String id;
    private String userId;
    private String username;
    private String content;
    private List<String> likes;
    private int likesCount;
    private int repostsCount;
    private List<CommentResponseDTO> comments;
    private int commentsCount;
    private boolean likedByCurrentUser;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
