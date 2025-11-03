package com.arep.twitter.postservice.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.arep.twitter.postservice.model.Post;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    
    Page<Post> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    List<Post> findTop20ByOrderByCreatedAtDesc();
    
    Page<Post> findByUserIdInOrderByCreatedAtDesc(List<String> userIds, Pageable pageable);
    
    long countByUserId(String userId);
}
