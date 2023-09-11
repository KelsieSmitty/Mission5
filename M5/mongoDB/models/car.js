import mongoose from "mongoose";

// Car schema
const carSchema = mongoose.Schema({
  body: { type: String },
  make: { type: String },
  model: { type: String },
  color: { type: String },
  year: { type: Number },
  price: { type: Number },
  image: { type: String },
});

// Define & export
export default mongoose.model("Car", carSchema);
