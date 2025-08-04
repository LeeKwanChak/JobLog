package com.myapp.job_application_tracker.service;

import com.myapp.job_application_tracker.model.Application;
import com.myapp.job_application_tracker.projection.ApplicationSkillsProjection;
import com.myapp.job_application_tracker.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
public class StatisticService {
    private final ApplicationRepository applicationRepository;

    public StatisticService(ApplicationRepository applicationRepository){
        this.applicationRepository = applicationRepository;
    }

    public int findTotalNumber(Long userId){
        return applicationRepository.findByUserIdOrderByCompanyNameAsc(userId).size();
    }

    public void Top10SkillsRequired(Long userId){
        List<ApplicationSkillsProjection> skillsList = applicationRepository.findRequiredSkillsByUserId(userId);
        HashMap<String, Integer> map = new HashMap<String, Integer>();

        for(ApplicationSkillsProjection skills: skillsList){
            String skillsString = skills.getRequiredSkills();
            if(skillsString != null){

            }
        }

    }

    public void ApplicationOverTime(Long userId){

    }

    public void Top5ApplyLocation(Long userId){

    }

}
