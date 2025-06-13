import React from "react";
import "./Banner.css";

function Banner() {
  return (
    <header
      className="banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("https://images.squarespace-cdn.com/content/v1/5efce5920d28887981c5bd9b/1620325755456-HV7G0OW366L9OEPUPR2C/Lupin+Part+2+banner.jpg")`,
        backgroundPosition: "center center",
      }}
    >
      <div className="banner_contents">
        <h1 className="banner_title">Movie Name</h1>
        <div className="banner__buttons">
          <button className="banner__button">Play</button>
          <button className="banner__button">My List</button>
        </div>
        <h1 className="banner__description">This is a test description</h1>
      </div>

      <div className="banner--fadeBottom" />
    </header>
  );
}

export default Banner;
