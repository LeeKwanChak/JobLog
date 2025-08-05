package com.myapp.job_application_tracker.repository;

import com.myapp.job_application_tracker.model.Application;
import com.myapp.job_application_tracker.projection.ApplicationSkillsProjection;
import com.myapp.job_application_tracker.projection.TopLocationProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long>, JpaSpecificationExecutor<Application> {
    List<Application> findByUserIdOrderByCompanyNameAsc(Long id);

    List<ApplicationSkillsProjection> findRequiredSkillsByUserId(Long id);

    @Query("""
            SELECT a.location AS location, COUNT(a.location) AS count
            From Application a
            WHERE a.user.id = :userId AND a.location IS NOT NULL
            GROUP BY a.location
            ORDER BY COUNT(a.location) DESC
            """)
    List<TopLocationProjection> findTopLocations(@Param("userId") Long userId, Pageable pageable);

    List<Application> findByUserIdAndApplyDateBetween(Long userId, LocalDate start, LocalDate end);
}
