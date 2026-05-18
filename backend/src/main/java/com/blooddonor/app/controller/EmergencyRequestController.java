package com.blooddonor.app.controller;

import com.blooddonor.app.dto.EmergencyRequestDto;
import com.blooddonor.app.service.EmergencyRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Emergency blood request endpoints.
 */
@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class EmergencyRequestController {

    private final EmergencyRequestService requestService;

    // Public — anyone can view active emergency requests
    @GetMapping
    public ResponseEntity<List<EmergencyRequestDto>> getActiveRequests() {
        return ResponseEntity.ok(requestService.getActiveRequests());
    }

    // Authenticated users can create requests
    @PostMapping
    public ResponseEntity<EmergencyRequestDto> createRequest(
            @Valid @RequestBody EmergencyRequestDto dto) {
        return ResponseEntity.ok(requestService.createRequest(dto));
    }

    // Update request status (authenticated)
    @PutMapping("/{id}")
    public ResponseEntity<EmergencyRequestDto> updateRequest(
            @PathVariable Long id,
            @RequestBody EmergencyRequestDto dto) {
        return ResponseEntity.ok(requestService.updateRequest(id, dto));
    }

    // Delete a completed/resolved request (authenticated)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }
}
