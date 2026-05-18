package com.blooddonor.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DonorRequest {

    @NotBlank(message = "Blood group is required")
    @Pattern(regexp = "^(A|B|AB|O)[+-]$", message = "Invalid blood group")
    private String bloodGroup;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Phone number is required")
    private String phone;

    private boolean available = true;

    private LocalDate lastDonationDate;
}
