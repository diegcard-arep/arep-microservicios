package com.arep.twitter.streamservice.service;

import com.arep.twitter.streamservice.dto.PostDTO;
import com.arep.twitter.streamservice.dto.TimelineDTO;
import com.arep.twitter.streamservice.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StreamService {
    
    private final WebClient.Builder webClientBuilder;
    
    @Value("${user-service.url}")
    private String userServiceUrl;
    
    @Value("${post-service.url}")
    private String postServiceUrl;
    
    public TimelineDTO getGlobalTimeline(String currentUserId, int page, int size, String token) {
        log.info("Getting global timeline for user: {}", currentUserId);
        
        WebClient webClient = webClientBuilder.build();
        
        try {
            // Get all posts
            String url = String.format("%s/api/posts?userId=%s&page=%d&size=%d", 
                postServiceUrl, currentUserId, page, size);
            
            PageResponse response = webClient.get()
                    .uri(url)
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .bodyToMono(PageResponse.class)
                    .block();
            
            TimelineDTO timeline = new TimelineDTO();
            timeline.setPosts(response != null ? response.getContent() : new ArrayList<>());
            timeline.setPage(page);
            timeline.setSize(size);
            timeline.setTotalElements(response != null ? response.getTotalElements() : 0);
            timeline.setTotalPages(response != null ? response.getTotalPages() : 0);
            
            return timeline;
        } catch (Exception e) {
            log.error("Error getting global timeline", e);
            return new TimelineDTO(new ArrayList<>(), page, size, 0, 0);
        }
    }
    
    public TimelineDTO getPersonalTimeline(String currentUserId, int page, int size, String token) {
        log.info("Getting personal timeline for user: {}", currentUserId);
        
        WebClient webClient = webClientBuilder.build();
        
        try {
            // Get current user info to get following list
            UserDTO user = webClient.get()
                    .uri(userServiceUrl + "/api/users/" + currentUserId)
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .bodyToMono(UserDTO.class)
                    .block();
            
            if (user == null || user.getFollowing() == null || user.getFollowing().isEmpty()) {
                // If not following anyone, return global timeline
                return getGlobalTimeline(currentUserId, page, size, token);
            }
            
            // Get posts from all following users
            List<PostDTO> allPosts = new ArrayList<>();
            
            for (String followedUserId : user.getFollowing()) {
                try {
                    String url = String.format("%s/api/posts/user/%s?currentUserId=%s&page=0&size=50", 
                        postServiceUrl, followedUserId, currentUserId);
                    
                    PageResponse response = webClient.get()
                            .uri(url)
                            .header("Authorization", "Bearer " + token)
                            .retrieve()
                            .bodyToMono(PageResponse.class)
                            .block();
                    
                    if (response != null && response.getContent() != null) {
                        allPosts.addAll(response.getContent());
                    }
                } catch (Exception e) {
                    log.error("Error getting posts for user: {}", followedUserId, e);
                }
            }
            
            // Also include current user's posts
            try {
                String url = String.format("%s/api/posts/user/%s?currentUserId=%s&page=0&size=50", 
                    postServiceUrl, currentUserId, currentUserId);
                
                PageResponse response = webClient.get()
                        .uri(url)
                        .header("Authorization", "Bearer " + token)
                        .retrieve()
                        .bodyToMono(PageResponse.class)
                        .block();
                
                if (response != null && response.getContent() != null) {
                    allPosts.addAll(response.getContent());
                }
            } catch (Exception e) {
                log.error("Error getting posts for current user", e);
            }
            
            // Sort by created date descending
            List<PostDTO> sortedPosts = allPosts.stream()
                    .sorted(Comparator.comparing(PostDTO::getCreatedAt).reversed())
                    .collect(Collectors.toList());
            
            // Paginate
            int start = page * size;
            int end = Math.min(start + size, sortedPosts.size());
            
            List<PostDTO> paginatedPosts = start < sortedPosts.size() 
                    ? sortedPosts.subList(start, end) 
                    : new ArrayList<>();
            
            TimelineDTO timeline = new TimelineDTO();
            timeline.setPosts(paginatedPosts);
            timeline.setPage(page);
            timeline.setSize(size);
            timeline.setTotalElements(sortedPosts.size());
            timeline.setTotalPages((int) Math.ceil((double) sortedPosts.size() / size));
            
            return timeline;
        } catch (Exception e) {
            log.error("Error getting personal timeline", e);
            return new TimelineDTO(new ArrayList<>(), page, size, 0, 0);
        }
    }
    
    public TimelineDTO getUserTimeline(String userId, String currentUserId, int page, int size, String token) {
        log.info("Getting timeline for user: {}", userId);
        
        WebClient webClient = webClientBuilder.build();
        
        try {
            String url = String.format("%s/api/posts/user/%s?currentUserId=%s&page=%d&size=%d", 
                postServiceUrl, userId, currentUserId, page, size);
            
            PageResponse response = webClient.get()
                    .uri(url)
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .bodyToMono(PageResponse.class)
                    .block();
            
            TimelineDTO timeline = new TimelineDTO();
            timeline.setPosts(response != null ? response.getContent() : new ArrayList<>());
            timeline.setPage(page);
            timeline.setSize(size);
            timeline.setTotalElements(response != null ? response.getTotalElements() : 0);
            timeline.setTotalPages(response != null ? response.getTotalPages() : 0);
            
            return timeline;
        } catch (Exception e) {
            log.error("Error getting user timeline", e);
            return new TimelineDTO(new ArrayList<>(), page, size, 0, 0);
        }
    }
    
    // Helper class for page response
    @lombok.Data
    public static class PageResponse {
        private List<PostDTO> content;
        private int number;
        private int size;
        private long totalElements;
        private int totalPages;
    }
}
