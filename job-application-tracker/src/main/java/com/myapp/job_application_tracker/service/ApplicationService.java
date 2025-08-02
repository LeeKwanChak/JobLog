package com.myapp.job_application_tracker.service;

import com.myapp.job_application_tracker.enums.ApplicationStatus;
import com.myapp.job_application_tracker.exception.NotFoundException;
import com.myapp.job_application_tracker.model.Application;
import com.myapp.job_application_tracker.repository.ApplicationRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.Predicate;
import org.springframework.util.StringUtils;


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
        return applicationRepository.findByUserIdOrderByCompanyNameAsc(userId);
    }


    @Transactional
    public void deleteApplication(Long id){
        if(!applicationRepository.existsById(id)){
            throw new NotFoundException("Application", id);
        }
        applicationRepository.deleteById(id);
    }

    public Page<Application> getFilteredApplication(
            Long userId,
            String companyName,
            String jobTitle,
            ApplicationStatus applicationStatus,
            String requiredSkills,
            Pageable pageable){

        Specification<Application> spec = (root, query, criteriaBuilder) ->{
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get("user").get("id"),userId));

            if(StringUtils.hasText(companyName)){
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("companyName")), "%"+companyName.toLowerCase()+"%"));
            }
            if(StringUtils.hasText(jobTitle)){
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("jobTitle")),"%"+jobTitle.toLowerCase()+"%"));
            }

            if(applicationStatus!=null){
                predicates.add(criteriaBuilder.equal(root.get("applicationStatus"),applicationStatus));
            }

            if(StringUtils.hasText(requiredSkills)){
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("requiredSkills")),"%"+requiredSkills.toLowerCase()+"%"));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        return applicationRepository.findAll(spec,pageable);
    }

}
