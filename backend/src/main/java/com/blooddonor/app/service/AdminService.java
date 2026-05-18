package com.blooddonor.app.service;

import com.blooddonor.app.exception.ResourceNotFoundException;
import com.blooddonor.app.model.User;
import com.blooddonor.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Admin-only operations: user management, blocking/unblocking.
 */
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    public User toggleBlockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setBlocked(!user.isBlocked());
        return userRepository.save(user);
    }
}
