import React, { useState } from "react";
import axios from "axios";
import "../styling/autoMatchmaker.css";
import tHeart from "../images/tHeart.png";
import { FaRegHeart } from "react-icons/fa";

function AutoMatchmaker() {
  const [recognitionResult, setRecognitionResult] = useState("");
  const [matchingCars, setMatchingCars] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [carType, setCarType] = useState("");
  const [carColor, setCarColor] = useState("");

  const apiUrl = "http://localhost:4000/api";

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        try {
          const response = await axios.post(apiUrl, reader.result, {
            headers: {
              "Content-Type": "image/jpeg",
            },
          });

          const { carType, carColor } = response.data;

          setRecognitionResult(
            `Sounds like your type is ${carType} & ${carColor}! 😉
            Here's a few suitors that just may work:`
          );

          setCarType(carType);
          setCarColor(carColor);

          setUploadedImage(URL.createObjectURL(file));
        } catch (error) {
          console.error("Error uploading and recognizing the image:", error);
        }
      };
    } catch (error) {
      console.error("Error uploading and recognizing the image:", error);
    }
  };

  const searchMatchingCars = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/cars", {
        params: {
          carType,
          carColor,
        },
      });

      setMatchingCars(response.data);
    } catch (error) {
      console.error("Error searching for cars:", error);
    }
  };

  React.useEffect(() => {
    if (carType && carColor) {
      searchMatchingCars();
    }
  }, [carType, carColor]);

  return (
    <div className="autoMatchmaker-container">
      <div className="heading-container">
        <img src={tHeart} alt="Heart Logo" className="heart-logo" />
        <h1>Turner's AutoMatchmaker</h1>
        <img src={tHeart} alt="Heart Logo" className="heart-logo" />
      </div>
      <div className="hero-container">
        <br />
        <div className="input-container">
          <h3>
            Upload an image below of what you're liking the look of, and we'll
            match you with one of our sweet rides for sale that's just your
            style!
          </h3>
          <input
            type="file"
            className="file-upload"
            alt="uploadedImage"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {/* Display the uploaded image here */}
          {uploadedImage && (
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="uploaded-image"
            />
          )}
          <br />
          <button onClick={searchMatchingCars}>Show Matching Cars</button>{" "}
        </div>
      </div>
      <div className="result-container">
        <h2>Auto-Matchmaking Result:</h2>
        <p>{recognitionResult}</p>
        <h3>Matching Car Options:</h3>
        <div className="matching-cars">
          {matchingCars.map((car, index) => (
            <div className="car-card" key={index}>
              <img
                className="car-image"
                src={car.image}
                alt={`${car.make} ${car.model}`}
              />
              <div className="car-info">
                <p className="car-info-heading">
                  Car Type: <span>{car.carType}</span>
                </p>
                <p className="car-info-heading">
                  Make: <span>{car.make}</span>
                </p>
                <p className="car-info-heading">
                  Model:<span>{car.model}</span>
                </p>
                <p className="car-info-heading">
                  Year: <span>{car.year}</span>
                </p>
                <p className="car-info-heading">
                  Price: <span>${car.price}</span>
                </p>
                <p className="car-info-heading">
                  Color: <span>{car.color}</span>
                </p>
              </div>
              <div className="icon-container">
                <FaRegHeart className="heart-icon" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AutoMatchmaker;
