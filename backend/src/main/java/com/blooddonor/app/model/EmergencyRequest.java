package com.blooddonor.app.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * EmergencyRequest entity — stores urgent blood requests from patients/hospitals.
 */
@Entity
@Table(name = "emergency_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_name", nullable = false)
    private String patientName;

    @Column(name = "blood_group", nullable = false)
    private String bloodGroup;

    @Column(name = "hospital_name", nullable = false)
    private String hospitalName;

    @Column(nullable = false)
    private String city;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Urgency urgency;

    @Column(name = "contact_info", nullable = false)
    private String contactInfo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum Urgency {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum Status {
        ACTIVE, FULFILLED, CLOSED
    }
}
