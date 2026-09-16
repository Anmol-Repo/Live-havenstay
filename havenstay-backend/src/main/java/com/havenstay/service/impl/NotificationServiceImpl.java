package com.havenstay.service.impl;

import com.havenstay.dto.NotificationDTO;
import com.havenstay.entity.Notification;
import com.havenstay.enums.NotificationType;
import com.havenstay.repository.NotificationRepository;
import com.havenstay.service.NotificationService;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final Resend resend;
    private final NotificationRepository notificationRepository;

    @Override
    @Async
    public void sendEmail(NotificationDTO notificationDTO) {

        log.info("Inside send email using Resend");

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("HavenStay <onboarding@resend.dev>")
                .to(notificationDTO.getRecipient())
                .subject(notificationDTO.getSubject())
                .text(notificationDTO.getBody())
                .build();

        try {
            resend.emails().send(params);

            log.info("Email sent successfully to {}", notificationDTO.getRecipient());

            Notification notificationToSave = Notification.builder()
                    .recipient(notificationDTO.getRecipient())
                    .subject(notificationDTO.getSubject())
                    .body(notificationDTO.getBody())
                    .bookingReference(notificationDTO.getBookingReference())
                    .type(NotificationType.EMAIL)
                    .build();

            notificationRepository.save(notificationToSave);

        } catch (ResendException e) {
            log.error("Failed to send email using Resend: {}", e.getMessage(), e);
        }
    }

    @Override
    public void sendSms() {

    }

    @Override
    public void sendWhatsapp() {

    }
}