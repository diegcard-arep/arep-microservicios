package com.arep.twitter.userservice.service;

import com.arep.twitter.userservice.dto.UserDTO;
import com.arep.twitter.userservice.dto.UserResponseDTO;
import com.arep.twitter.userservice.model.User;
import com.arep.twitter.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    
    @Transactional
    public UserResponseDTO createUser(UserDTO userDTO, String cognitoSub) {
        log.info("Creating user with cognito sub: {}", cognitoSub);
        
        // Check if user already exists
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setBio(userDTO.getBio());
        user.setProfileImageUrl(userDTO.getProfileImageUrl());
        user.setCognitoSub(cognitoSub);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        log.info("User created successfully: {}", savedUser.getId());
        
        return mapToResponseDTO(savedUser);
    }
    
    public UserResponseDTO getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponseDTO(user);
    }
    
    public UserResponseDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponseDTO(user);
    }
    
    public UserResponseDTO getUserByCognitoSub(String cognitoSub) {
        User user = userRepository.findByCognitoSub(cognitoSub)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponseDTO(user);
    }
    
    public List<UserResponseDTO> searchUsers(String username) {
        return userRepository.findByUsernameContainingIgnoreCase(username).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public UserResponseDTO updateUser(String id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (userDTO.getBio() != null) {
            user.setBio(userDTO.getBio());
        }
        
        if (userDTO.getProfileImageUrl() != null) {
            user.setProfileImageUrl(userDTO.getProfileImageUrl());
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        
        User updatedUser = userRepository.save(user);
        return mapToResponseDTO(updatedUser);
    }
    
    @Transactional
    public void followUser(String followerId, String followedId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("Followed user not found"));
        
        if (!follower.getFollowing().contains(followedId)) {
            follower.getFollowing().add(followedId);
            userRepository.save(follower);
        }
        
        if (!followed.getFollowers().contains(followerId)) {
            followed.getFollowers().add(followerId);
            userRepository.save(followed);
        }
    }
    
    @Transactional
    public void unfollowUser(String followerId, String followedId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("Followed user not found"));
        
        follower.getFollowing().remove(followedId);
        userRepository.save(follower);
        
        followed.getFollowers().remove(followerId);
        userRepository.save(followed);
    }
    
    private UserResponseDTO mapToResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setBio(user.getBio());
        dto.setProfileImageUrl(user.getProfileImageUrl());
        dto.setFollowing(user.getFollowing());
        dto.setFollowers(user.getFollowers());
        dto.setFollowingCount(user.getFollowing().size());
        dto.setFollowersCount(user.getFollowers().size());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}
