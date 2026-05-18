package com.blooddonor.app.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class DonorResponse {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String bloodGroup;
    private String city;
    private String phone;
    private boolean available;
    private LocalDate lastDonationDate;
}
