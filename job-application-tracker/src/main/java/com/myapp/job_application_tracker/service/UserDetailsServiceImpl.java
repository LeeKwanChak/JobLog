package com.myapp.job_application_tracker.service;

import com.myapp.job_application_tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.regex.Pattern;
import org.springframework.security.core.userdetails.UserDetails;
import com.myapp.job_application_tracker.model.User;

@Service("userDetailService")
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);

        public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException{
            User user = null;
            if(EMAIL_PATTERN.matcher(identifier).matches()){
                user = userRepository.findByUsername(identifier).orElse(null);
            }
            if(user == null){
                user = userRepository.findByUsername(identifier).orElseThrow(() -> new UsernameNotFoundException("User Not Found with identifier: "+ identifier));
            }

            return UserDetailsImpl.build(user);
        }
}
