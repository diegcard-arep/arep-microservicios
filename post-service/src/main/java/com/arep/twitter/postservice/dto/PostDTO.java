package com.arep.twitter.postservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDTO {
    
    @NotBlank(message = "Content is required")
    @Size(max = 140, message = "Post content must not exceed 140 characters")
    private String content;
}
