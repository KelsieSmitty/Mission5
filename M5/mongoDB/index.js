import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017/carcli";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToMongo() {
  try {
    await client.connect();
    console.info("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Add Car
const addCar = async (car) => {
  try {
    const db = client.db();
    const carsCollection = db.collection("cars");
    const result = await carsCollection.insertOne(car);
    console.info("New Car Added!");
  } catch (error) {
    console.error("Error adding car:", error);
  }
};

// Update Car
const updateCar = async (_id, car) => {
  try {
    const db = client.db();
    const carsCollection = db.collection("cars");
    const objectId = new ObjectId(_id);
    const filter = { _id: objectId };
    const updateDoc = { $set: car };
    const options = { returnOriginal: false };
    const result = await carsCollection.findOneAndUpdate(
      filter,
      updateDoc,
      options
    );
    if (result.value) {
      console.info("Car Updated!");
    } else {
      console.error("Car not found.");
    }
  } catch (error) {
    console.error("Error updating car:", error);
  }
};

// List All Cars
const listCars = async () => {
  try {
    const db = client.db();
    const carsCollection = db.collection("cars");
    const cars = await carsCollection.find().toArray();
    console.info(cars);
    console.info(`${cars.length} cars`);
  } catch (error) {
    console.error("Error listing cars:", error);
  }
};

// Remove Car
const removeCar = async (_id) => {
  try {
    const db = client.db();
    const carsCollection = db.collection("cars");
    const objectId = new ObjectId(_id);
    const result = await carsCollection.deleteOne({ _id: objectId });
    if (result.deletedCount === 1) {
      console.info("Car Removed!");
    } else {
      console.error("Car not found.");
    }
  } catch (error) {
    console.error("Error removing car:", error);
  }
};

// Find Car
const findCar = async (name) => {
  try {
    const db = client.db();
    const carsCollection = db.collection("cars");
    const search = new RegExp(name, "i");
    const cars = await carsCollection
      .find({ $or: [{ body: search }, { color: search }] })
      .toArray();
    console.info(cars);
    console.info(`${cars.length} matches`);
  } catch (error) {
    console.error("Error finding cars:", error);
  }
};

// Export All Methods
export { connectToMongo, addCar, findCar, updateCar, removeCar, listCars };
