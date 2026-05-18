package com.blooddonor.app.dto;

import com.blooddonor.app.model.EmergencyRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EmergencyRequestDto {

    private Long id;

    @NotBlank(message = "Patient name is required")
    private String patientName;

    @NotBlank(message = "Blood group is required")
    private String bloodGroup;

    @NotBlank(message = "Hospital name is required")
    private String hospitalName;

    @NotBlank(message = "City is required")
    private String city;

    @NotNull(message = "Urgency level is required")
    private EmergencyRequest.Urgency urgency;

    @NotBlank(message = "Contact information is required")
    private String contactInfo;

    private EmergencyRequest.Status status;

    private LocalDateTime createdAt;
}
