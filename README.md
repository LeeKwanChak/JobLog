# Job Application Tracker

A full stack app that allow user to track their job application. It use AI to automatically add job applications, saving manual input time and improving tracking efficiency.

![ApplicationPage Screenshot](screenshot/ApplicationPage.png)

## Why This Project?

* To provide an automated and efficient way to record job applications, eliminating the need for manual, repetitive data entry.
* To further develop my full-stack programming skills

## Key Feature

* Application Management: Easily Create, Read, Update, and Delete job application records.
* AI-Powered Autofill: Integration with selenium web scraping and Google Gemini API to automatically add applications by simply pasting a link
* Secure User Authentication: Support user registration and login system with secure JWT-based authentication.
* UI/UX: Clean and responsive frontend for a smooth user experience.

## Tech Stack

Backend
- Language: Java 17
- Framework: Spring Boot 3.5.3
- Database: PostgreSQL
- Authentication: Spring Security
- Dependency Management: Gradle

Frontend
- Language: TypeScript
- Framework: React.js
- Styling: Tailwind CSS
- Dependency Management: npm

## How to develop locally
> Note: A Docker-based setup is planned for the future. For now, follow the steps below to run locally.

1. Prerequisites
* JDK 17
* Node.js and npm
* PostgreSQL database server
* Chrome Browser and its corresponding ChromeDriver executable (required for the web scraping feature).

2. Clone the repository

3. Environment Variable Setup

For Backend:
* GEMINI_API_KEY: Your Google Gemini API key
* DATASOURCE_USERNAME: PostgreSQL database username
* DATASOURCE_PASSWORD: PostgreSQL database password
* JWT_SECRET: secret key for JWT authentication
* WEBDRIVER_CHROME_DRIVER_PATH: The absolute path to your ChromeDriver executable

For Frontend:
* VITE_API_URL: This variable defines the base URL for your backend API.

4. Database Setup
Ensure you have a PostgreSQL database named job-application-tracker-db created.

5. Run both the backend and the frontend

## Known Problems
* Web Scraping Resistance: The auto-add function, which relies on web scraping techniques, may encounter difficulties on certain websites that implement advanced anti-scraping measures.