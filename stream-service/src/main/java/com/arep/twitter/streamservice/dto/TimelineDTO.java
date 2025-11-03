package com.arep.twitter.streamservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimelineDTO {
    
    private List<PostDTO> posts;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
