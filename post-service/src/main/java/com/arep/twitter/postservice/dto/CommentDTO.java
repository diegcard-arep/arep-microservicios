package com.arep.twitter.postservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    
    @NotBlank(message = "Content is required")
    @Size(max = 280, message = "Comment content must not exceed 280 characters")
    private String content;
}
