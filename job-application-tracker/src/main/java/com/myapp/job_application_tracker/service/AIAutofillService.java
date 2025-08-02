package com.myapp.job_application_tracker.service;

import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import com.myapp.job_application_tracker.dto.AutofillResponse;
import com.myapp.job_application_tracker.enums.ApplicationStatus;
import com.myapp.job_application_tracker.exception.GeminiResponseException;
import com.myapp.job_application_tracker.exception.WebContentExtractionException;
import com.myapp.job_application_tracker.model.Application;
import com.myapp.job_application_tracker.model.User;
import com.myapp.job_application_tracker.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import java.time.LocalDate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AIAutofillService {
    private static final Logger logger = LoggerFactory.getLogger(AIAutofillService.class);

    private final WebClient webClient;
    private final Client geminiClient;
    private final ApplicationRepository applicationRepository;
    private final ObjectMapper objectMapper;
    @Value("${webdriver.chrome.driver.path}")
    private String chromedriverPath;


    public AIAutofillService(WebClient.Builder webClientBuilder, @Value("${gemini.api.key}") String geminiApiKey, ApplicationRepository applicationRepository){
        this.webClient = webClientBuilder.build();
        this.geminiClient = Client.builder().apiKey(geminiApiKey).build();
        this.applicationRepository = applicationRepository;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    public String getWebContent(String url){
        WebDriver driver = null;
        try{
            System.setProperty("webdriver.chrome.driver", chromedriverPath);
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--headless");
            options.addArguments("--disable-gpu");
            options.addArguments("--window-size=1920,1080");
            options.addArguments("--no-sandbox");
            options.addArguments("--disable-dev-shm-usage");
            options.addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36");
            options.addArguments("--log-level=3");
            options.addArguments("--silent");
            options.addArguments("--disable-extensions");
            options.addArguments("--disable-infobars");
            options.addArguments("--disable-notifications");
            options.addArguments("--disable-popup-blocking");
            options.addArguments("--blink-settings=imagesEnabled=false");

            driver = new ChromeDriver(options);
            driver.get(url);
            String web_html = driver.getPageSource();
            org.jsoup.nodes.Document doc = org.jsoup.Jsoup.parse(web_html);
            String cleanedText = doc.body().text();
            return cleanedText.substring(0, Math.min(cleanedText.length(), 4000));
        }catch(Exception e){
            logger.error("Error during Selenium web content extraction.");
            throw new WebContentExtractionException("Fail to extract the web html.");
        }finally {
            if(driver != null){
                driver.quit();
            }
        }
    }

    private AutofillResponse callGeminiApi(String webContent){
        if(webContent == null){
            throw new WebContentExtractionException("Fail to extract the web html.");
        }
        String prompt = "Please extract the following information from the provided job description text. Respond ONLY with a JSON object. If a field is not found or cannot be determined, use null for its value.\n" +
                "**If you encounter any garbled or unreadable characters, please ignore them and continue processing the next valid character.**\n\n" +
                "Please ignore cookie notices, terms and conditions, login/register prompts, navigation menu text, and other unrelated UI content. Focus only on analyzing the job posting\n"+
                "Fields to extract: companyName, jobTitle, requiredSkills (as a single comma-separated string), location, salary.\n" +
                "If provided, salary only return either one format: 1. $xxxxx - $xxxxx, 2. $xxxxx" +
                "Ensure the JSON is perfectly valid and directly parseable, without any additional text or markdown formatting.\n\n" +
                "Job Description Text:\n" + webContent + "\n\n" +
                "JSON Output Example: {\"companyName\": \"Google\", \"jobTitle\": \"Software Engineer\", \"requiredSkills\": \"Java, Spring Boot, Microservices\", \"location\": \"Hong Kong\", \"salary\": \"$18,000 - $24,000\"}";


        GenerateContentResponse response = null;
        try{
            response = geminiClient.models.generateContent(
                    "gemini-2.5-flash",
                    Content.fromParts(Part.fromText(prompt)),
                    GenerateContentConfig.builder()
                            .temperature(0.0f)
                            .maxOutputTokens(2000)
                            .build()
            );
        }catch (Exception e){
            throw new GeminiResponseException("Fail to get response from gemini-2.5-flash.");
        }
        logger.info("geminiResponse: "+ response);
        AutofillResponse autofillResponse = new AutofillResponse();
        String geminiResponseText = response.text();
        if(geminiResponseText == null){
            throw new GeminiResponseException("Fail to get response from gemini-2.5-flash, Gemini-2.5-flash response null.");
        }
        logger.info("geminiResponseText: "+ geminiResponseText);
        try{
            String extractedJsonString = geminiResponseText;
            if (extractedJsonString.startsWith("```json")) {
                extractedJsonString = extractedJsonString.substring(extractedJsonString.indexOf('\n') + 1);
            }
            if (extractedJsonString.endsWith("```")) {
                extractedJsonString = extractedJsonString.substring(0, extractedJsonString.lastIndexOf("```"));
            }
            extractedJsonString = extractedJsonString.trim();
            AutofillResponse parsedResponse = objectMapper.readValue(extractedJsonString, AutofillResponse.class);
            autofillResponse.setCompanyName(parsedResponse.getCompanyName());
            autofillResponse.setJobTitle(parsedResponse.getJobTitle());
            autofillResponse.setRequiredSkills(parsedResponse.getRequiredSkills());
            autofillResponse.setLocation(parsedResponse.getLocation());
            autofillResponse.setSalary(parsedResponse.getSalary());

        }catch (Exception e){
            throw new GeminiResponseException("Fail to get response from gemini-2.5-flash.");
        }
        return autofillResponse;
    }

    public Application autoFill(String url, User user){
        String webContent = getWebContent(url);
        logger.info(webContent);
        AutofillResponse autofillResponse = callGeminiApi(webContent);

        Application application = new Application();
        application.setCompanyName(autofillResponse.getCompanyName());
        application.setJobTitle(autofillResponse.getJobTitle());
        application.setRequiredSkills(autofillResponse.getRequiredSkills());
        application.setLocation(autofillResponse.getLocation());
        application.setApplyDate(LocalDate.now());
        application.setApplicationStatus(ApplicationStatus.Applied);
        application.setSalary(autofillResponse.getSalary());
        application.setUser(user);
        application.setUrl(url);

        return applicationRepository.save(application);
    }
}