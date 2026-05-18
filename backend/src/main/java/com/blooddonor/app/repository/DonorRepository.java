package com.blooddonor.app.repository;

import com.blooddonor.app.model.Donor;
import com.blooddonor.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {

    Optional<Donor> findByUser(User user);

    boolean existsByUser(User user);

    /**
     * Search donors by blood group and/or city, optionally filtering by availability.
     * Passing null for bloodGroup or city means "match all" (wildcard).
     */
    @Query("SELECT d FROM Donor d WHERE " +
           "(:bloodGroup IS NULL OR :bloodGroup = '' OR d.bloodGroup = :bloodGroup) AND " +
           "(:city IS NULL OR :city = '' OR LOWER(d.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(:availableOnly = false OR d.available = true)")
    List<Donor> searchDonors(
            @Param("bloodGroup") String bloodGroup,
            @Param("city") String city,
            @Param("availableOnly") boolean availableOnly
    );
}
