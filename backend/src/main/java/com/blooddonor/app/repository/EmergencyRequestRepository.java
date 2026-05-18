package com.blooddonor.app.repository;

import com.blooddonor.app.model.EmergencyRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyRequestRepository extends JpaRepository<EmergencyRequest, Long> {

    List<EmergencyRequest> findByStatusOrderByCreatedAtDesc(EmergencyRequest.Status status);

    List<EmergencyRequest> findAllByOrderByCreatedAtDesc();
}
