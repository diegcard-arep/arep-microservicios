package com.arep.twitter.postservice.service;

import com.arep.twitter.postservice.dto.CommentDTO;
import com.arep.twitter.postservice.dto.CommentResponseDTO;
import com.arep.twitter.postservice.dto.PostDTO;
import com.arep.twitter.postservice.dto.PostResponseDTO;
import com.arep.twitter.postservice.model.Comment;
import com.arep.twitter.postservice.model.Post;
import com.arep.twitter.postservice.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {
    
    private final PostRepository postRepository;
    
    @Transactional
    public PostResponseDTO createPost(PostDTO postDTO, String userId, String username) {
        log.info("Creating post for user: {}", userId);
        
        Post post = new Post();
        post.setUserId(userId);
        post.setUsername(username);
        post.setContent(postDTO.getContent());
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        
        Post savedPost = postRepository.save(post);
        log.info("Post created successfully: {}", savedPost.getId());
        
        return mapToResponseDTO(savedPost, userId);
    }
    
    public PostResponseDTO getPostById(String id, String currentUserId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return mapToResponseDTO(post, currentUserId);
    }
    
    public Page<PostResponseDTO> getPostsByUserId(String userId, String currentUserId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return posts.map(post -> mapToResponseDTO(post, currentUserId));
    }
    
    public Page<PostResponseDTO> getAllPosts(String currentUserId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        return posts.map(post -> mapToResponseDTO(post, currentUserId));
    }
    
    public List<PostResponseDTO> getRecentPosts(String currentUserId) {
        List<Post> posts = postRepository.findTop20ByOrderByCreatedAtDesc();
        return posts.stream()
                .map(post -> mapToResponseDTO(post, currentUserId))
                .collect(Collectors.toList());
    }
    
    @Transactional
    public PostResponseDTO likePost(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (!post.getLikes().contains(userId)) {
            post.getLikes().add(userId);
            post.setLikesCount(post.getLikes().size());
            post.setUpdatedAt(LocalDateTime.now());
            postRepository.save(post);
        }
        
        return mapToResponseDTO(post, userId);
    }
    
    @Transactional
    public PostResponseDTO unlikePost(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (post.getLikes().remove(userId)) {
            post.setLikesCount(post.getLikes().size());
            post.setUpdatedAt(LocalDateTime.now());
            postRepository.save(post);
        }
        
        return mapToResponseDTO(post, userId);
    }
    
    @Transactional
    public void deletePost(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this post");
        }
        
        postRepository.delete(post);
    }
    
    public long countUserPosts(String userId) {
        return postRepository.countByUserId(userId);
    }
    
    @Transactional
    public CommentResponseDTO addComment(String postId, CommentDTO commentDTO, String userId, String username) {
        log.info("Adding comment to post: {} by user: {}", postId, userId);
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        Comment comment = new Comment();
        comment.setId(UUID.randomUUID().toString());
        comment.setUserId(userId);
        comment.setUsername(username);
        comment.setContent(commentDTO.getContent());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        
        post.getComments().add(comment);
        post.setCommentsCount(post.getComments().size());
        post.setUpdatedAt(LocalDateTime.now());
        
        postRepository.save(post);
        log.info("Comment added successfully to post: {}", postId);
        
        return mapToCommentResponseDTO(comment);
    }
    
    public List<CommentResponseDTO> getComments(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        return post.getComments().stream()
                .map(this::mapToCommentResponseDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteComment(String postId, String commentId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        Comment comment = post.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this comment");
        }
        
        post.getComments().remove(comment);
        post.setCommentsCount(post.getComments().size());
        post.setUpdatedAt(LocalDateTime.now());
        
        postRepository.save(post);
    }
    
    private PostResponseDTO mapToResponseDTO(Post post, String currentUserId) {
        PostResponseDTO dto = new PostResponseDTO();
        dto.setId(post.getId());
        dto.setUserId(post.getUserId());
        dto.setUsername(post.getUsername());
        dto.setContent(post.getContent());
        dto.setLikes(post.getLikes());
        dto.setLikesCount(post.getLikesCount());
        dto.setRepostsCount(post.getRepostsCount());
        dto.setComments(post.getComments().stream()
                .map(this::mapToCommentResponseDTO)
                .collect(Collectors.toList()));
        dto.setCommentsCount(post.getCommentsCount());
        dto.setLikedByCurrentUser(post.getLikes().contains(currentUserId));
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        return dto;
    }
    
    private CommentResponseDTO mapToCommentResponseDTO(Comment comment) {
        CommentResponseDTO dto = new CommentResponseDTO();
        dto.setId(comment.getId());
        dto.setUserId(comment.getUserId());
        dto.setUsername(comment.getUsername());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }
}
