"use strict";

const mongoose = require("mongoose");

const connectString = `mongodb://localhost:27017/dbs`;

class Database {
  static instance;
  constructor() {
    this.connect();
  }
  //connect to database
  connect(type = "mongodb") {
    //dev mode
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString)
      .then(() => {
        console.log("Database is connected, ");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
      console.log("Database is connected");
    }
    return this.instance;
  }
}
const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
