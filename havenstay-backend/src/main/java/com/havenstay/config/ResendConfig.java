package com.havenstay.config;

import com.resend.Resend;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ResendConfig {

    @Bean
    public Resend resend() {
        return new Resend(System.getenv("RESEND_API_KEY"));


    }
}