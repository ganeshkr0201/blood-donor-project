package com.blooddonor.app.service;

import com.blooddonor.app.dto.EmergencyRequestDto;
import com.blooddonor.app.exception.ResourceNotFoundException;
import com.blooddonor.app.model.EmergencyRequest;
import com.blooddonor.app.repository.EmergencyRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Business logic for creating and managing emergency blood requests.
 */
@Service
@RequiredArgsConstructor
public class EmergencyRequestService {

    private final EmergencyRequestRepository requestRepository;

    public List<EmergencyRequestDto> getAllRequests() {
        return requestRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<EmergencyRequestDto> getActiveRequests() {
        return requestRepository.findByStatusOrderByCreatedAtDesc(EmergencyRequest.Status.ACTIVE)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public EmergencyRequestDto createRequest(EmergencyRequestDto dto) {
        EmergencyRequest request = EmergencyRequest.builder()
                .patientName(dto.getPatientName())
                .bloodGroup(dto.getBloodGroup())
                .hospitalName(dto.getHospitalName())
                .city(dto.getCity())
                .urgency(dto.getUrgency())
                .contactInfo(dto.getContactInfo())
                .status(EmergencyRequest.Status.ACTIVE)
                .build();

        return toDto(requestRepository.save(request));
    }

    public EmergencyRequestDto updateRequest(Long id, EmergencyRequestDto dto) {
        EmergencyRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + id));

        if (dto.getStatus() != null) {
            request.setStatus(dto.getStatus());
        }
        if (dto.getPatientName() != null) request.setPatientName(dto.getPatientName());
        if (dto.getBloodGroup() != null) request.setBloodGroup(dto.getBloodGroup());
        if (dto.getHospitalName() != null) request.setHospitalName(dto.getHospitalName());
        if (dto.getCity() != null) request.setCity(dto.getCity());
        if (dto.getUrgency() != null) request.setUrgency(dto.getUrgency());
        if (dto.getContactInfo() != null) request.setContactInfo(dto.getContactInfo());

        return toDto(requestRepository.save(request));
    }

    public void deleteRequest(Long id) {
        EmergencyRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + id));
        requestRepository.delete(request);
    }

    private EmergencyRequestDto toDto(EmergencyRequest request) {
        EmergencyRequestDto dto = new EmergencyRequestDto();
        dto.setId(request.getId());
        dto.setPatientName(request.getPatientName());
        dto.setBloodGroup(request.getBloodGroup());
        dto.setHospitalName(request.getHospitalName());
        dto.setCity(request.getCity());
        dto.setUrgency(request.getUrgency());
        dto.setContactInfo(request.getContactInfo());
        dto.setStatus(request.getStatus());
        dto.setCreatedAt(request.getCreatedAt());
        return dto;
    }
}
