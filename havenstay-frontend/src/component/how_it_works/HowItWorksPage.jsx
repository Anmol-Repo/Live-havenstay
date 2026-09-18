import React, { useState } from "react";

const HowItWorksPage = () => {

    const [selectedStep, setSelectedStep] = useState(0);

    const steps = [
        {
            number: "01",
            title: "Explore Rooms",
            icon: "./images/explore-icon.png",
            description:
                "Browse the available rooms at HavenStay and explore the different room types, prices, capacities and amenities.",
            image: "./images/how/how-explore.png"
        },
        {
            number: "02",
            title: "Search for Availability",
            icon: "./images/search-icon.png",
            description:
                "Select your room type, check-in date and check-out date to find rooms available for your stay.",
            image: "./images/how/how-search.png"
        },
        {
            number: "03",
            title: "Select & Book",
            icon: "./images/how/book-icon.png",
            description:
                "Choose a room that fits your needs, select your stay dates and review the booking details before confirming.",
            image: "./images/how-book.png"
        },
        {
            number: "04",
            title: "Make Payment",
            icon: "./images/payment-icon.png",
            description:
                "Proceed to secure online payment through Razorpay to complete the payment for your booking.",
            image: "./images/how/how-payment.png"
        },
        {
            number: "05",
            title: "Booking Confirmation",
            icon: "./images/confirmation-icon.png",
            description:
                "After successful payment, your booking is confirmed and you receive the booking and payment information through email.",
            image: "./images/how/how-confirmation.png"
        }
    ];
 

    const currentStep = steps[selectedStep];


    const handlePrevious = () => {
        if (selectedStep > 0) {
            setSelectedStep(selectedStep - 1);
        }
    };


    const handleNext = () => {
        if (selectedStep < steps.length - 1) {
            setSelectedStep(selectedStep + 1);
        }
    };


    return (
        <div className="how-it-works-page">

            <div className="how-it-works-header">
                <h1>How It Works</h1>
                <p>
                    Book your stay at HavenStay in just a few simple steps.
                </p>
            </div>


            <div className="how-it-works-content">

                {/* STEP NAVIGATION */}
                <div className="how-it-works-steps">

                    {steps.map((step, index) => (

                        <div
                            key={step.number}
                            className={`how-step ${
                                selectedStep === index ? "selected-step" : ""
                            }`}
                            onClick={() => setSelectedStep(index)}
                        >

                            <span className="how-step-number">
                                {step.number}
                            </span>

                            <img
                                src={step.icon}
                                alt=""
                                className="how-left-icon"
                            />

                            <span className="how-step-title">
                                {step.title}
                            </span>

                        </div>

                    ))}

                </div>


                {/* STEP DETAILS */}
                <div className="how-it-works-details">

                    <div className="how-step-heading">

                        <span>{currentStep.number}</span>

                        {/* <img
                            src={currentStep.icon}
                            alt=""
                            className="how-step-icon"
                        /> */}

                        <h2>{currentStep.title}</h2>

                    </div>


                    <p className="how-step-description">
                        {currentStep.description}
                    </p>


                    <div className="how-step-image-container">
                        <img
                            src={currentStep.image}
                            alt={currentStep.title}
                            className="how-step-image"
                        />
                    </div>


                    <div className="how-step-controls">

                        <button
                            onClick={handlePrevious}
                            disabled={selectedStep === 0}
                        >
                            ← Previous
                        </button>


                        <div className="how-step-progress">

                            {steps.map((step, index) => (
                                <span
                                    key={step.number}
                                    className={`progress-dot ${
                                        selectedStep === index
                                            ? "active-progress-dot"
                                            : ""
                                    }`}
                                    onClick={() => setSelectedStep(index)}
                                ></span>
                            ))}

                        </div>


                        <button
                            onClick={handleNext}
                            disabled={selectedStep === steps.length - 1}
                        >
                            Next →
                        </button>

                    </div>

                </div>

            </div>


            {/* FINAL CTA */}
            <div className="how-it-works-cta">

                <h2>Ready to book your stay?</h2>

                <p>
                    Explore our rooms and find the right one for your stay.
                </p>

                <button onClick={() => window.location.href = "/rooms"}>
                    Explore Rooms →
                </button>

            </div>

        </div>
    );
};

export default HowItWorksPage;