package com.andromedia.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andromedia.model.User;
import com.andromedia.repository.UserRepository;

@Service
public class SubscriptionService {

    private final UserRepository userRepository;

    public SubscriptionService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public void subscribe(String email, Long channelId) {
        User subscriber = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User channel = userRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("Channel not found"));

        if (subscriber.getId().equals(channel.getId())) {
            throw new RuntimeException("Cannot subscribe to yourself");
        }

        if (subscriber.getSubscribedTo() == null) {
            subscriber.setSubscribedTo(new HashSet<>());
        }
        subscriber.getSubscribedTo().add(channel);
        userRepository.save(subscriber);
    }

    @Transactional
    public void unsubscribe(String email, Long channelId) {
        User subscriber = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User channel = userRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("Channel not found"));

        if (subscriber.getSubscribedTo() != null) {
            subscriber.getSubscribedTo().remove(channel);
            userRepository.save(subscriber);
        }
    }

    public boolean isSubscribed(String email, Long channelId) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return false;
        }
        return userRepository.isSubscribed(userOpt.get().getId(), channelId);
    }

    public int getSubscriberCount(Long channelId) {
        return userRepository.countSubscribers(channelId);
    }

    @Transactional(readOnly = true)
    public List<User> getSubscriptions(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getSubscribedTo() == null) {
            return List.of();
        }
        return List.copyOf(user.getSubscribedTo());
    }
}
