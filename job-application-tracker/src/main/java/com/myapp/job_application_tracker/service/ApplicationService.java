package com.myapp.job_application_tracker.service;

import com.myapp.job_application_tracker.exception.NotFoundException;
import com.myapp.job_application_tracker.model.Application;
import com.myapp.job_application_tracker.repository.ApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    @Autowired
    public ApplicationService(ApplicationRepository applicationRepository){
        this.applicationRepository = applicationRepository;
    }

    @Transactional
    public Application saveApplication(Application application){
        return applicationRepository.save(application);
    }

    @Transactional(readOnly = true)
    public Application getApplicationById(Long id){
        return applicationRepository.findById(id).orElseThrow(() -> new NotFoundException("Application", id));
    }
    @Transactional(readOnly = true)
    public List<Application> getAllApplicationsByUserId(Long userId) {
        return applicationRepository.findByUserId(userId);
    }
    @Transactional
    public void deleteApplication(Long id){
        if(!applicationRepository.existsById(id)){
            throw new NotFoundException("Application", id);
        }
        applicationRepository.deleteById(id);
    }

}
