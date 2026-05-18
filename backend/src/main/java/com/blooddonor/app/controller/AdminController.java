package com.blooddonor.app.controller;

import com.blooddonor.app.dto.EmergencyRequestDto;
import com.blooddonor.app.model.User;
import com.blooddonor.app.service.AdminService;
import com.blooddonor.app.service.EmergencyRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only endpoints — user management and full request visibility.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final EmergencyRequestService requestService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/toggle-block")
    public ResponseEntity<User> toggleBlockUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleBlockUser(id));
    }

    @GetMapping("/requests")
    public ResponseEntity<List<EmergencyRequestDto>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }
}
