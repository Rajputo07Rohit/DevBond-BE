const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Rohit123:Rohit0870@namastenode.4buqp7i.mongodb.net/DevBond-BE"
  );
};

module.exports = connectDB;
