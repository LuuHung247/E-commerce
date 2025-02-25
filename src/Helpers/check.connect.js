"use strict";

// Count the number of connections
const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 10000;

const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections: ${numConnection}`);
};

// Check server load
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCpus = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Example maximum number of connections bases on number of cpus
    const maxConnections = numCpus * 10;

    console.log(`Number of connections: ${numConnection}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
    if (numConnection > maxConnections) {
      console.log("Server is overload"); // Report overload detected
    }
  }, _SECONDS); // Monitor every 10 seconds
};

module.exports = {
  countConnect,
  checkOverload,
};
