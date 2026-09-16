package com.havenstay.service.impl;

import com.havenstay.dto.BookingDTO;
import com.havenstay.dto.NotificationDTO;
import com.havenstay.dto.ResponseDTO;
import com.havenstay.entity.Booking;
import com.havenstay.entity.Room;
import com.havenstay.entity.User;
import com.havenstay.enums.BookingStatus;
import com.havenstay.enums.PaymentStatus;
import com.havenstay.exception.InvalidBookingStateAndDateException;
import com.havenstay.exception.NotFoundException;
import com.havenstay.repository.BookingRepository;
import com.havenstay.repository.RoomRepository;
import com.havenstay.service.BookingCodeGenerator;
import com.havenstay.service.BookingService;
import com.havenstay.service.NotificationService;
import com.havenstay.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.awt.print.Book;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final NotificationService notificationService;
    private final ModelMapper modelMapper;
    private final UserService userService;
    private final BookingCodeGenerator bookingCodeGenerator;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public ResponseDTO getAllBookings() {
        List<Booking> bookingList = bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        List<BookingDTO> bookingDTOList = modelMapper.map(bookingList, new TypeToken<List<BookingDTO>>() {}.getType());

        for(BookingDTO bookingDTO: bookingDTOList){
            bookingDTO.setUser(null);
            bookingDTO.setRoom(null);
        }

        return  ResponseDTO.builder()
                .status(200)
                .message("success")
                .bookings(bookingDTOList)
                .build();
    }

    @Override
    public ResponseDTO createBooking(BookingDTO bookingDTO) {
        User currentUser = userService.getCurrentLoggedInUser();
        Room room = roomRepository.findById(bookingDTO.getRoomId())
                .orElseThrow(()-> new NotFoundException("Room Not Found"));

        //validation: Ensure the check-in date is not before today
        if (bookingDTO.getCheckInDate().isBefore(LocalDate.now())){
            throw new InvalidBookingStateAndDateException("check in date cannot be before today ");
        }

        //validation: Ensure the check-out date is not before check in date
        if (bookingDTO.getCheckOutDate().isBefore(bookingDTO.getCheckInDate())){
            throw new InvalidBookingStateAndDateException("check out date cannot be before check in date ");
        }

        //validation: Ensure the check-in date is not same as check out date
        if (bookingDTO.getCheckInDate().isEqual(bookingDTO.getCheckOutDate())){
            throw new InvalidBookingStateAndDateException("check in date cannot be equal to check out date ");
        }

        //vlaidate room availablity
        boolean isAvailable = bookingRepository.isRoomAvailable(room.getId(),bookingDTO.getCheckInDate(),bookingDTO.getCheckOutDate());
        if(!isAvailable){
            throw new InvalidBookingStateAndDateException("Room is not available for the selected date ranges");
        }

        //calculate total price for stay
        BigDecimal totalPrice = calculateTotalPrice(room, bookingDTO);
        String bookingReference = bookingCodeGenerator.generateBookingReference();

        //create and save booking
        Booking booking = new Booking();
        booking.setUser(currentUser);
        booking.setRoom(room);
        booking.setCheckInDate(bookingDTO.getCheckInDate());
        booking.setCheckOutDate(bookingDTO.getCheckOutDate());
        booking.setTotalPrice(totalPrice);
        booking.setBookingReference(bookingReference);
        booking.setBookingStatus(BookingStatus.BOOKED);
        booking.setPaymentStatus(PaymentStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());

        bookingRepository.save(booking);

        bookingDTO.setBookingReference(bookingReference);

        //generate the payment url which will be sent  by mail
        String paymentUrl = frontendUrl + "/payment/" + bookingReference;


        log.info("PAYMENT LINK: {}",paymentUrl);

        //send notification via email
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .recipient(currentUser.getEmail())
                .subject("Booking Confirmation")
                .body(String.format("Your booking has  been successfully created.\n\n" +
                        "Booking Reference: %s\n" +
                        "Total Amount: ₹%s\n\n" +
                        "Please proceed with your payment using the link below"+  "\n%s", bookingReference,
                        totalPrice,
                         paymentUrl))
                .bookingReference(bookingReference)
                .build();

        notificationService.sendEmail(notificationDTO); //sending mail

       return ResponseDTO.builder()
                .status(200)
                .message("Booking is successful")
                .booking(bookingDTO)
                .build();
    }

    @Override
    public ResponseDTO findBookingByReferenceNo(String bookingReference ) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(()-> new NotFoundException("Booking with reference No: "+ bookingReference + "Not found"));

        BookingDTO bookingDTO = modelMapper.map(booking, BookingDTO.class);
        return ResponseDTO.builder()
                .status(200)
                .message("success")
                .booking(bookingDTO)
                .build();
    }

    @Override
    public ResponseDTO updateBooking(BookingDTO bookingDTO) {
        if(bookingDTO.getId() == null ) throw  new NotFoundException("Booking id is required");
        Booking existingBooking = bookingRepository.findById(bookingDTO.getId())
                .orElseThrow(()-> new NotFoundException("Booking not found"));

        if (bookingDTO.getBookingStatus() != null){
            existingBooking.setBookingStatus(bookingDTO.getBookingStatus());
        }

        if(bookingDTO.getPaymentStatus() != null){
            existingBooking.setPaymentStatus(bookingDTO.getPaymentStatus());
        }

        bookingRepository.save(existingBooking);

        return ResponseDTO.builder()
                .status(200)
                .message("Booking updated successfully").build();
    }

    private BigDecimal calculateTotalPrice( Room room, BookingDTO bookingDTO){
        BigDecimal pricePerNight = room.getPricePerNight();
        long days = ChronoUnit.DAYS.between(bookingDTO.getCheckInDate(), bookingDTO.getCheckOutDate());
        return pricePerNight.multiply(BigDecimal.valueOf(days));
    }
}

















