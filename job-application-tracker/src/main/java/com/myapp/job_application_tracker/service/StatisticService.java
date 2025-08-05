package com.myapp.job_application_tracker.service;

import com.myapp.job_application_tracker.model.Application;
import com.myapp.job_application_tracker.projection.ApplicationSkillsProjection;
import com.myapp.job_application_tracker.projection.TopLocationProjection;
import com.myapp.job_application_tracker.repository.ApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
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

    public void Top5SkillsRequired(Long userId){
        List<ApplicationSkillsProjection> skillsList = applicationRepository.findRequiredSkillsByUserId(userId);
        HashMap<String, Integer> map = new HashMap<>();

        for(ApplicationSkillsProjection skills: skillsList){
            String skillsString = skills.getRequiredSkills();
            if(skillsString != null){

            }
        }

    }

    public int[] ApplicationOverTime(Long userId){
        int[] days7 = new int[7];
        List<Application> applications = applicationRepository
                .findByUserIdAndApplyDateBetween(userId, LocalDate.now().minusDays(6), LocalDate.now());

        for (Application app: applications){
            long daysAgo = ChronoUnit.DAYS.between(app.getApplyDate(), LocalDate.now());
            days7[(int) daysAgo]++;
        }
        return days7;
    }

    public List<TopLocationProjection> Top5ApplyLocation(Long userId){
        return applicationRepository.findTopLocations(userId, PageRequest.of(0, 5));
    }

}
