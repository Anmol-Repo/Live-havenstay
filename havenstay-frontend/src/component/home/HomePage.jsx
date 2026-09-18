import React, { useState, useEffect } from "react";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";
import ApiService from "../../service/ApiService";


const HomePage = () => {

   const [roomSearchResult, setRoomSearchResult] = useState([]);
const [featuredRooms, setFeaturedRooms] = useState([]);

// function to handle search result
const handleSearchResult = (results) => {
    setRoomSearchResult(results);
    console.log("ReSILT IS: " + results)
}

// Get one random room from each room type
 useEffect(() => {
    const fetchFeaturedRooms = async () => {
        try {
            const resp = await ApiService.getAllRooms();
            const rooms = resp.rooms || [];

            const roomTypes = ["SINGLE", "DOUBLE", "TRIPLE", "SUIT"];

            const selectedRooms = roomTypes.map((type) => {
                const roomsOfType = rooms.filter(room => room.type === type);

                if (roomsOfType.length === 0) {
                    return null;
                }

                const randomIndex = Math.floor(Math.random() * roomsOfType.length);
                return roomsOfType[randomIndex];
            }).filter(room => room !== null);

            setFeaturedRooms(selectedRooms);

        } catch (error) {
            console.log("Error fetching featured rooms: " + error.message);
        }
    };

    fetchFeaturedRooms();
}, []);


return(
    <div className="home">

        <section>
            <header className="header-banner">
                <img src="./images/bg.jpg" alt="Hotel" className="header-image" />
                <div className="overlay"></div>
                <div className="animated-texts overlay-content">
                    <h1>Welcome to <span className="phegon-color">HavenStay</span></h1> <br/>
                    <h3>Step into a haven of comfort and care</h3>
                </div>
            </header>
        </section>


        <RoomSearch handSearchResult={handleSearchResult}/>
        <RoomResult roomSearchResults={roomSearchResult}/>


        {/* FEATURED ROOMS */}
        <section className="featured-rooms">

            <h2 className="featured-rooms-title">
                Featured Rooms
            </h2>

            <p className="featured-rooms-subtitle">
                Discover a few of our comfortable rooms at HavenStay
            </p>

            <div className="featured-room-container">

                {featuredRooms.map((room) => (

                    <div className="featured-room-card" key={room.id}>

                        <img
                            src={room.imageUrl}
                            alt={`${room.type} Room`}
                            className="featured-room-image"
                        />

                        <div className="featured-room-details">

                            <h3>
                                {room.type} Room
                            </h3>

                            <p className="featured-room-number">
                                Room {room.roomNumber}
                            </p>

                            <p className="featured-room-price">
                                ₹{room.pricePerNight}
                                <span> / night</span>
                            </p>

                            <p className="featured-room-capacity">
                                Capacity: {room.capacity} guests
                            </p>

                            <button
                                className="featured-room-button"
                                onClick={() => window.location.href = `/room-details/${room.id}`}
                            >
                                View Room →
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </section>


        <div className="view-all-rooms">
            <button onClick={() => window.location.href = "/rooms"}>
                View All Rooms
            </button>
        </div>


     {/* WHY HAVENSTAY */}
<h2 className="home-services">
    Why <span className="phegon-color">HavenStay?</span>
</h2>

<section className="service-section">

      <div className="service-card">
        <img src="./images/wifi2.png" alt="WiFi" />
        <div className="service-details">
            <h3 className="service-title">Stay Connected</h3>
            <p className="service-description">
                Stay connected with WiFi available throughout your stay.
            </p>
        </div>
    </div>

    <div className="service-card">
        <img src="./images/easy-search.png" alt="Easy Room Search" />
        <div className="service-details">
            <h3 className="service-title">Easy Room Search</h3>
            <p className="service-description">
                Search rooms by type and check availability for your selected dates.
            </p>
        </div>
    </div>

    <div className="service-card">
        <img src="./images/secure-booking.png" alt="Secure Booking" />
        <div className="service-details">
            <h3 className="service-title">Secure Booking</h3>
            <p className="service-description">
                Your booking flow is protected through user authentication and authorization.
            </p>
        </div>
    </div>

    <div className="service-card">
        <img src="./images/online-payment.png" alt="Online Payment" />
        <div className="service-details">
            <h3 className="service-title">Online Payment</h3>
            <p className="service-description">
                Complete your booking with online payments through Razorpay.
            </p>
        </div>
    </div>

    <div className="service-card">
        <img src="./images/1email-confirmation.png" alt="Email Confirmation" />
        <div className="service-details">
            <h3 className="service-title">Email Confirmation</h3>
            <p className="service-description">
                Receive your booking and payment information through email notifications.
            </p>
        </div>
    </div>

     <div className="service-card">
        <img src="./images/ac.png" alt="Air Conditioning" />
        <div className="service-details">
            <h3 className="service-title">Comfortable Rooms</h3>
            <p className="service-description">
                Enjoy comfortable rooms equipped with amenities such as air conditioning.
            </p>
        </div>
    </div>

  
    

</section>

    </div>
)

}

export default HomePage
