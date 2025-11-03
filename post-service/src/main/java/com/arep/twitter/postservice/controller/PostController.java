package com.arep.twitter.postservice.controller;

import com.arep.twitter.postservice.dto.CommentDTO;
import com.arep.twitter.postservice.dto.CommentResponseDTO;
import com.arep.twitter.postservice.dto.PostDTO;
import com.arep.twitter.postservice.dto.PostResponseDTO;
import com.arep.twitter.postservice.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "https://d84l1y8p4kdic.cloudfront.net"})
public class PostController {
    
    private final PostService postService;
    
    @PostMapping
    public ResponseEntity<PostResponseDTO> createPost(
            @Valid @RequestBody PostDTO postDTO,
            @RequestParam String userId,
            @RequestParam String username,
            Authentication authentication) {
        
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String cognitoSub = jwt.getSubject();
        
        log.info("Creating post for user: {} with cognito sub: {}", userId, cognitoSub);
        
        PostResponseDTO post = postService.createPost(postDTO, userId, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDTO> getPostById(
            @PathVariable String id,
            @RequestParam String userId) {
        
        PostResponseDTO post = postService.getPostById(id, userId);
        return ResponseEntity.ok(post);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<PostResponseDTO>> getPostsByUserId(
            @PathVariable String userId,
            @RequestParam String currentUserId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<PostResponseDTO> posts = postService.getPostsByUserId(userId, currentUserId, page, size);
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping
    public ResponseEntity<Page<PostResponseDTO>> getAllPosts(
            @RequestParam String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<PostResponseDTO> posts = postService.getAllPosts(userId, page, size);
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<PostResponseDTO>> getRecentPosts(@RequestParam String userId) {
        List<PostResponseDTO> posts = postService.getRecentPosts(userId);
        return ResponseEntity.ok(posts);
    }
    
    @PostMapping("/{id}/like")
    public ResponseEntity<PostResponseDTO> likePost(
            @PathVariable String id,
            @RequestParam String userId,
            Authentication authentication) {
        
        PostResponseDTO post = postService.likePost(id, userId);
        return ResponseEntity.ok(post);
    }
    
    @PostMapping("/{id}/unlike")
    public ResponseEntity<PostResponseDTO> unlikePost(
            @PathVariable String id,
            @RequestParam String userId,
            Authentication authentication) {
        
        PostResponseDTO post = postService.unlikePost(id, userId);
        return ResponseEntity.ok(post);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePost(
            @PathVariable String id,
            @RequestParam String userId,
            Authentication authentication) {
        
        postService.deletePost(id, userId);
        return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
    }
    
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Map<String, Long>> countUserPosts(@PathVariable String userId) {
        long count = postService.countUserPosts(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }
    
    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponseDTO> addComment(
            @PathVariable String id,
            @Valid @RequestBody CommentDTO commentDTO,
            @RequestParam String userId,
            @RequestParam String username,
            Authentication authentication) {
        
        log.info("Adding comment to post: {} by user: {}", id, userId);
        
        CommentResponseDTO comment = postService.addComment(id, commentDTO, userId, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }
    
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponseDTO>> getComments(@PathVariable String id) {
        List<CommentResponseDTO> comments = postService.getComments(id);
        return ResponseEntity.ok(comments);
    }
    
    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<Map<String, String>> deleteComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @RequestParam String userId,
            Authentication authentication) {
        
        postService.deleteComment(postId, commentId, userId);
        return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "post-service"));
    }
}
