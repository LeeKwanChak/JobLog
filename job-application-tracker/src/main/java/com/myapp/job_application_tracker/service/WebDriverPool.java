package com.myapp.job_application_tracker.service;

import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.stereotype.Component;
import org.openqa.selenium.WebDriver;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.TimeUnit;
import java.time.Duration;
import org.openqa.selenium.PageLoadStrategy;

@Component
public class WebDriverPool {
    private final BlockingQueue<WebDriver> pool;
    private static final int POOL_SIZE = 3;

    public WebDriverPool(){
        pool = new ArrayBlockingQueue<>(POOL_SIZE);
        for (int i = 0; i < POOL_SIZE; i++){
            pool.add(createDriver());
        }
    }

    public WebDriver createDriver(){
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.7204.184 Safari/537.36");
        options.addArguments("--log-level=3");
        options.addArguments("--silent");
        options.addArguments("--disable-extensions");
        options.addArguments("--disable-infobars");
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-popup-blocking");
        options.addArguments("--blink-settings=imagesEnabled=false");
        options.setPageLoadStrategy(PageLoadStrategy.EAGER);
        options.addArguments("--disable-css");

        return new ChromeDriver(options);
    }

    public WebDriver acquire() throws InterruptedException{
        WebDriver driver = pool.poll(10, TimeUnit.SECONDS);
        if (driver == null) {
            throw new RuntimeException("Timeout: no available WebDriver in the pool.");
        }


        return driver;
    }

    public void release(WebDriver driver){
        if(driver == null) return;

        try{
            driver.manage().deleteAllCookies();
            driver.navigate().to("about:blank");
        }catch (Exception e){
            quitQuietly(driver);
            return;
        }

        if(isDriverAlive(driver)){
            pool.offer(driver);
        }else{
            quitQuietly(driver);
        }

    }

    public void shutdown(){
        for(WebDriver driver: pool){
            driver.quit();
        }
        pool.clear();
    }

    private boolean isDriverAlive(WebDriver driver) {
        try {
            driver.getTitle();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private void quitQuietly(WebDriver driver) {
        try {
            driver.quit();
        } catch (Exception ignored) {
        }
    }
}
