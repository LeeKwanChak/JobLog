package com.myapp.job_application_tracker.repository;

import com.myapp.job_application_tracker.model.Application;
import com.myapp.job_application_tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserId(Long id);

}
