package com.andromedia.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.andromedia.repository.UserRepository;
import com.andromedia.model.User;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
}
