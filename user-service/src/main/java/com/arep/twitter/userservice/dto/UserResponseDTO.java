package com.arep.twitter.userservice.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    
    private String id;
    private String username;
    private String email;
    private String bio;
    private String profileImageUrl;
    private List<String> following;
    private List<String> followers;
    private int followingCount;
    private int followersCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
