package com.blooddonor.app.service;

import com.blooddonor.app.dto.DonorRequest;
import com.blooddonor.app.dto.DonorResponse;
import com.blooddonor.app.exception.BadRequestException;
import com.blooddonor.app.exception.ResourceNotFoundException;
import com.blooddonor.app.model.Donor;
import com.blooddonor.app.model.User;
import com.blooddonor.app.repository.DonorRepository;
import com.blooddonor.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Business logic for donor registration, updates, and search.
 */
@Service
@RequiredArgsConstructor
public class DonorService {

    private final DonorRepository donorRepository;
    private final UserRepository userRepository;

    public List<DonorResponse> getAllDonors() {
        return donorRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public DonorResponse registerDonor(DonorRequest request) {
        User currentUser = getCurrentUser();

        if (donorRepository.existsByUser(currentUser)) {
            throw new BadRequestException("You are already registered as a donor");
        }

        Donor donor = Donor.builder()
                .user(currentUser)
                .bloodGroup(request.getBloodGroup())
                .city(request.getCity())
                .phone(request.getPhone())
                .available(request.isAvailable())
                .lastDonationDate(request.getLastDonationDate())
                .build();

        return toResponse(donorRepository.save(donor));
    }

    public DonorResponse updateDonor(Long id, DonorRequest request) {
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with id: " + id));

        User currentUser = getCurrentUser();
        // Only the donor themselves or an admin can update
        if (!donor.getUser().getId().equals(currentUser.getId()) &&
                !currentUser.getRole().equals(User.Role.ADMIN)) {
            throw new BadRequestException("You are not authorized to update this donor profile");
        }

        donor.setBloodGroup(request.getBloodGroup());
        donor.setCity(request.getCity());
        donor.setPhone(request.getPhone());
        donor.setAvailable(request.isAvailable());
        donor.setLastDonationDate(request.getLastDonationDate());

        return toResponse(donorRepository.save(donor));
    }

    public void deleteDonor(Long id) {
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with id: " + id));
        donorRepository.delete(donor);
    }

    public List<DonorResponse> searchDonors(String bloodGroup, String city, boolean availableOnly) {
        // Normalize: treat null and blank as empty string — JPQL handles "" as wildcard
        String bg = (bloodGroup != null) ? bloodGroup.trim() : "";
        String ct = (city != null)       ? city.trim()       : "";
        return donorRepository.searchDonors(bg, ct, availableOnly).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private DonorResponse toResponse(Donor donor) {
        DonorResponse response = new DonorResponse();
        response.setId(donor.getId());
        response.setUserId(donor.getUser().getId());
        response.setName(donor.getUser().getName());
        response.setEmail(donor.getUser().getEmail());
        response.setBloodGroup(donor.getBloodGroup());
        response.setCity(donor.getCity());
        response.setPhone(donor.getPhone());
        response.setAvailable(donor.isAvailable());
        response.setLastDonationDate(donor.getLastDonationDate());
        return response;
    }
}
