package com.arep.twitter.userservice.repository;

import com.arep.twitter.userservice.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByCognitoSub(String cognitoSub);
    
    List<User> findByUsernameContainingIgnoreCase(String username);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
}
