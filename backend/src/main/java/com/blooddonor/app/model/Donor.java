package com.blooddonor.app.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Donor entity — stores blood donor profile linked to a user account.
 */
@Entity
@Table(name = "donors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "blood_group", nullable = false)
    private String bloodGroup;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    @Builder.Default
    private boolean available = true;

    @Column(name = "last_donation_date")
    private LocalDate lastDonationDate;
}
