package com.blooddonor.app.controller;

import com.blooddonor.app.dto.DonorRequest;
import com.blooddonor.app.dto.DonorResponse;
import com.blooddonor.app.service.DonorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Donor management endpoints — CRUD and search.
 */
@RestController
@RequestMapping("/api/donors")
@RequiredArgsConstructor
public class DonorController {

    private final DonorService donorService;

    @GetMapping
    public ResponseEntity<List<DonorResponse>> getAllDonors() {
        return ResponseEntity.ok(donorService.getAllDonors());
    }

    @PostMapping
    public ResponseEntity<DonorResponse> registerDonor(@Valid @RequestBody DonorRequest request) {
        return ResponseEntity.ok(donorService.registerDonor(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DonorResponse> updateDonor(
            @PathVariable Long id,
            @Valid @RequestBody DonorRequest request) {
        return ResponseEntity.ok(donorService.updateDonor(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonor(@PathVariable Long id) {
        donorService.deleteDonor(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Search donors by blood group, city, and availability.
     * Example: GET /api/donors/search?bloodGroup=O%2B&city=Delhi&availableOnly=true
     */
    @GetMapping("/search")
    public ResponseEntity<List<DonorResponse>> searchDonors(
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) String city,
            @RequestParam(defaultValue = "false") boolean availableOnly) {
        return ResponseEntity.ok(donorService.searchDonors(bloodGroup, city, availableOnly));
    }
}
