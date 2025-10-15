package com.andromedia.service;

import com.andromedia.repository.UserRepository;
import com.andromedia.model.User;;
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }
}
