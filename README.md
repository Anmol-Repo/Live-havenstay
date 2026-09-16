# HavenStay

A full-stack hotel booking application built with **React** and **Spring Boot**, with customer/admin workflows, room availability checks, JWT-based authentication, Razorpay payments, transactional email notifications, image hosting, and production deployment.

## Live Application

- **Frontend:** https://havenstay-booking.netlify.app
- **Backend API:** https://havenstay-backend-jgqa.onrender.com
- **Backend health check:** https://havenstay-backend-jgqa.onrender.com/api/health
- **Source Code:** https://github.com/Anmol-Repo/havenstay

> The live frontend is served by Netlify and communicates with the Spring Boot backend deployed on Render. The backend uses an Aiven MySQL database.

## What HavenStay Does

HavenStay models the main flow of a hotel booking platform:

1. A customer creates an account and signs in.
2. Customers browse available rooms and search/filter room results.
3. A customer selects check-in and check-out dates and reviews the calculated stay price.
4. The backend validates the dates and checks the room for booking conflicts before creating a booking.
5. A booking reference is generated and the booking is created with a pending payment state.
6. The customer is taken to the payment flow and can pay through Razorpay.
7. The backend verifies the Razorpay payment signature before marking the payment as completed.
8. Booking confirmation information is sent by email and the notification is stored in the database.
9. Administrators can manage rooms and update booking/payment status.

## Core Features

### Customer

- Registration and login
- JWT-based authentication
- Browse rooms
- Search rooms
- Filter by room type, dates and related room attributes through backend APIs
- View room details
- Select check-in/check-out dates
- Automatic stay-duration and total-price calculation
- Create bookings
- Find/view a booking using its booking reference
- View account information and booking history
- Update account details
- Razorpay payment flow
- Payment success/failure pages

### Admin

- Separate `ADMIN` role
- Admin-only room management
- Add, edit and delete rooms
- Manage bookings
- Update booking status
- Update payment status
- Admin dashboard/pages for room and booking management

## Booking Availability Logic

A room cannot be booked when another active booking overlaps the requested dates.

The backend checks existing bookings whose status is either:

- `BOOKED`
- `CHECKED_IN`

The overlap check compares the requested check-in/check-out dates with existing booking dates before allowing a new booking.

The booking service also validates that:

- check-in is not before the current date
- check-out is not before check-in
- check-in and check-out are not the same date
- the requested room exists
- the room is available for the selected dates

The total price is calculated from the room's nightly price multiplied by the number of stay days.

## Payment Flow

HavenStay integrates **Razorpay** for payment processing.

The backend:

1. Creates a Razorpay order from the booking amount.
2. Uses the booking reference as part of the receipt value.
3. Exposes payment verification through a backend endpoint.
4. Verifies the Razorpay payment signature using **HMAC-SHA256** over the Razorpay order ID and payment ID.
5. Updates the payment and booking payment status after successful verification.

Supported payment status values in the domain model include:

- `PENDING`
- `COMPLETED`
- `FAILED`
- `REFUNDED`
- `REVERSED`

The current implementation does **not** implement an automatic refund workflow, payment webhooks, or customer self-service booking cancellation.

## Email Notifications

Booking confirmation emails are sent through **Resend**.

The notification service runs asynchronously and also stores the notification record in the database after a successful send.

The production sender uses Resend's development sender address:

`HavenStay <onboarding@resend.dev>`

No application secrets are stored in the repository. Production credentials such as the Resend API key, database credentials, JWT secret and Razorpay secrets are supplied through environment variables.

## Authentication & Authorization

The backend uses **Spring Security** with stateless JWT authentication.

### Authentication

- Email/password registration and login
- Passwords are encoded with **BCrypt**
- Login generates a JWT containing the user's email as the subject
- Requests authenticate through a custom bearer-token filter
- Security context is populated for authenticated requests
- Sessions are stateless

### Authorization

HavenStay has two application roles:

- `CUSTOMER`
- `ADMIN`

Backend authorization is enforced with Spring Security and method-level authorization annotations. Admin operations such as room management and booking management require the `ADMIN` role.

The React application also uses route guards for customer/admin navigation, but the backend remains the security boundary for protected operations.

## REST API

The backend exposes REST endpoints grouped by responsibility.

| Area | Example endpoints | Purpose |
|---|---|---|
| Authentication | `POST /api/auth/register` | Register a user |
| Authentication | `POST /api/auth/login` | Authenticate a user |
| Rooms | `GET /api/rooms/all` | List rooms |
| Rooms | `GET /api/rooms/available` | Find available rooms |
| Rooms | `GET /api/rooms/search?input=...` | Search rooms |
| Rooms | `GET /api/rooms/types` | Get room types |
| Rooms | `POST /api/rooms/add` | Admin room creation |
| Rooms | `PUT /api/rooms/update` | Admin room update |
| Rooms | `DELETE /api/rooms/delete/{id}` | Admin room deletion |
| Bookings | `POST /api/bookings/` | Create a booking |
| Bookings | `GET /api/bookings/{reference}` | Find a booking |
| Bookings | `GET /api/bookings/all` | Admin booking management |
| Bookings | `PUT /api/bookings/update` | Admin booking/payment status update |
| Payments | `POST /api/payments/pay` | Create/process payment order flow |
| Payments | `POST /api/payments/verify` | Verify Razorpay payment |
| Users | `GET /api/users/account` | Current account details |
| Users | `PUT /api/users/update` | Update current account |
| Users | `GET /api/users/bookings` | Current user's bookings |
| Health | `GET /api/health` | Application + database health check |

The exact request/response models are represented by DTOs in the backend source.

## Backend Architecture

The backend follows a conventional layered Spring Boot structure:

`Controller → Service → Repository → JPA/Hibernate → MySQL`

Additional infrastructure handles security, payment integration, image hosting, and email notifications.

### Main layers

**Controllers** expose HTTP endpoints and map incoming requests to application operations.

**Services** contain application/business logic such as booking validation, availability checks, room management, authentication and payment state updates.

**Repositories** use Spring Data JPA for persistence and custom JPQL queries where required.

**DTOs** separate API request/response models from persistence entities.

**Entities** represent users, rooms, bookings, payments, booking references and notifications.

## Database Model

The application currently uses MySQL through **Aiven**.

Main domain entities include:

- `User`
- `Room`
- `Booking`
- `BookingReference`
- `Payment`
- `Notification`

Important relationships include:

- A booking belongs to a user.
- A booking belongs to a room.
- A payment is associated with a user and a booking reference.
- Notifications can be associated with a booking reference.

Hibernate is configured with `ddl-auto=update` for the deployed application, allowing Hibernate to maintain the database schema from the mapped entities.

## Room Model

Each room stores:

- Room number
- Room type
- Price per night
- Capacity
- Description
- Image URL

Room types in the application are:

- `SINGLE`
- `DOUBLE`
- `TRIPLE`
- `SUIT`

Images are uploaded through the backend and stored using **ImageKit**, with the resulting URL saved with the room record.

## Frontend

The frontend is a **React** application using:

- React
- React Router
- Axios
- Custom CSS
- `react-day-picker`
- Razorpay React integration
- CryptoJS

The frontend contains separate route flows for customers and administrators.

Representative customer routes include:

- `/home`
- `/rooms`
- `/room-details/:roomId`
- `/find-booking`
- `/profile`
- `/edit-profile`
- `/payment/:bookingReference`
- `/payment-success/:bookingReference`
- `/payment-failure/:bookingReference`

Representative admin routes include:

- `/admin`
- `/admin/manage-rooms`
- `/admin/add-room`
- `/admin/edit-room/:roomId`
- `/admin/manage-bookings`
- `/admin/edit-booking/:bookingCode`

## Deployment

The application is deployed as separate frontend and backend services.

### Frontend

- Platform: **Netlify**
- Production API URL is supplied through `REACT_APP_API_URL`
- React Router refresh/direct-route handling is configured with a Netlify `_redirects` file

### Backend

- Platform: **Render**
- Runtime: Docker container
- Container image: Docker Hub
- Database: Aiven MySQL
- Production configuration: environment variables
- Health monitoring: UptimeRobot

### Docker

The backend uses a multi-stage Docker build with separate build/runtime stages. The repository also includes a `.dockerignore` file to exclude build artifacts, Git metadata, IDE files and local environment files from the Docker build context.

## Configuration

Create the required environment variables in the environment where the application runs.

### Backend variables

The backend expects values for configuration including:

- `PORT`
- `DATASOURCE_URL`
- `DATASOURCE_USERNAME`
- `DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `FRONTEND_URL`
- `IMAGEKIT_PRIVATE_KEY`
- `IMAGEKIT_PUBLIC_KEY`
- `RESEND_API_KEY`

Mail-related Gmail properties may still exist in the configuration file from the earlier email implementation, but production notification delivery now uses Resend.

### Frontend variable

`REACT_APP_API_URL`

For production, this points to:

`https://havenstay-backend-jgqa.onrender.com/api`

> Never commit actual secrets, database passwords, payment secrets, JWT secrets or API keys to Git.

## Local Development

### Backend prerequisites

- Java 25
- Maven
- MySQL-compatible database or the required Aiven connection
- Environment variables for the backend services

Run the Spring Boot application from the backend project with your configured environment variables.

### Frontend prerequisites

- Node.js
- npm

Install dependencies and start the React development server using the project's package configuration.

The frontend must point `REACT_APP_API_URL` to the backend you intend to use (local or deployed).

## Testing & Verification

The application was tested through API-level testing in Postman and through end-to-end application flows after deployment.

The production booking flow was manually verified through:

`Registration → Login → Room selection → Booking → Payment → Payment verification → Email notification`

During production verification, an email-delivery issue with the original Gmail SMTP setup was identified and the notification system was migrated to Resend. The deployed Resend implementation was then tested successfully.

## Current Scope & Limitations

The current project intentionally keeps the architecture focused on a conventional monolithic Spring Boot backend rather than introducing unnecessary distributed infrastructure.

Current limitations include:

- Customer self-service booking cancellation is not implemented.
- There is no automatic refund implementation.
- Payment webhook handling is not implemented.
- Unpaid `PENDING` bookings do not have an automatic expiry/deletion process.
- SMS and WhatsApp notification methods are placeholders; email is the implemented notification channel.
- Reviews are not implemented.
- Automated CI/CD through GitHub Actions is not implemented.
- Swagger/OpenAPI documentation is not currently included.
- The repository does not include an exported Postman collection or architecture/ER diagram at this time.

## Repository Structure

The repository contains the React frontend and Spring Boot backend source/configuration used to build and deploy the application.

A typical backend organization includes:

```text
src/main/java/com/havenstay/
├── controller/
├── dto/
├── entity/
├── enums/
├── exception/
├── repository/
├── security/
├── service/
│   └── impl/
└── config/
```

Frontend code is organized around React pages/components and shared API/navigation logic.

## Engineering Highlights

- Layered Spring Boot architecture with Controller/Service/Repository separation
- DTO-based API design
- JPA entity relationships and custom JPQL availability logic
- Date-overlap validation for room booking conflicts
- JWT authentication with Spring Security
- Role-based authorization for customer/admin operations
- BCrypt password hashing
- Razorpay order creation and HMAC-SHA256 signature verification
- Asynchronous email notifications with Resend
- Image upload integration through ImageKit
- Dockerized backend deployment
- Environment-based production configuration
- Health endpoint that validates database connectivity
- Separate Netlify frontend and Render backend deployment

## Project Status

**Live and deployed.**

The repository represents the current working version of HavenStay and is intended as a portfolio project demonstrating Java/Spring Boot backend development, database design, business logic, security, third-party service integration and production deployment.
