import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import _ from "lodash";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const apiAddress = process.env.API_ADDRESS;

app.use(express.raw({ type: "image/jpeg", limit: "10mb" }));
app.use(cors());

const uri = process.env.MONGODB_URI || "mongodb://my-mongodb:27017/carcli";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const carSchema = new mongoose.Schema({
  body: String,
  color: String,
});

const Car = mongoose.model("Car", carSchema);

app.post("/api", async (req, res) => {
  try {
    const imageBinary = req.body;
    const predictionKey = process.env.PREDICTION_KEY;
    const contentType = process.env.CONTENT_TYPE;

    const headers = {
      "Prediction-Key": predictionKey,
      "Content-Type": contentType,
    };

    const response = await axios.post(apiAddress, imageBinary, { headers });

    const carTypeKeywords = ["sedan", "suv", "hatchback", "pickup", "truck"];
    const colorKeywords = ["black", "blue", "grey", "white", "red"];

    const predictions = response.data.predictions;

    let categorisedPredictions = {
      carType: [],
      color: [],
    };

    for (const prediction of predictions) {
      const predictionText = prediction.tagName.toLowerCase();

      if (carTypeKeywords.includes(predictionText)) {
        categorisedPredictions.carType.push(predictionText);
      } else if (colorKeywords.includes(predictionText)) {
        categorisedPredictions.color.push(predictionText);
      }
    }

    const highestCarType = getHighestProbability(
      categorisedPredictions.carType,
      predictions
    );
    const highestColor = getHighestProbability(
      categorisedPredictions.color,
      predictions
    );

    function getHighestProbability(category, predictions) {
      let highestProbability = -1;
      let highestPrediction = "";

      for (const prediction of predictions) {
        const predictionText = prediction.tagName.toLowerCase();

        if (
          category.includes(predictionText) &&
          prediction.probability > highestProbability
        ) {
          highestProbability = prediction.probability;
          highestPrediction = predictionText;
        }
      }

      return capitaliseFirstLetter(highestPrediction);
    }

    function capitaliseFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    res.json({
      carType: capitaliseFirstLetter(highestCarType),
      carColor: capitaliseFirstLetter(highestColor),
    });
  } catch (error) {
    console.error("Error making the prediction:", error);
    res
      .status(500)
      .json({ error: "An error occurred while making the prediction." });
  }
});

app.get("/api/cars", async (req, res) => {
  try {
    const carType = req.query.carType;
    const carColor = req.query.carColor;

    const cars = await Car.find({
      body: carType,
      color: carColor,
    });

    res.json(cars);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching data from the database.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}, yeah boy!`);
});
