"use strict";

const mongoose = require("mongoose");
const {
  db: { host, name, port },
} = require("../Configs/config.mongodb");
const connectString = `mongodb://${host}:${port}/${name}`;

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
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
      console.log(`Database is connected to ${connectString}`);
    }
    return this.instance;
  }
}
const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
