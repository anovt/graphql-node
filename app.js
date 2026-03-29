const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const jwt = require("jsonwebtoken");
const AuthError = require("./errors/AuthError");

const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "kafka-service",
  brokers: ["localhost:29092"],
});

const producer = kafka.producer();

// const { graphqlUploads } = require("graphql-upload/graphqlUploadExpress.js");
const JWT_SECRET = process.env.JWT_SECRET;



async function start() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (formattedError) => {
      // Apollo will automatically set the HTTP status code
      delete formattedError.locations;
      delete formattedError.extensions;
      return formattedError;
    },
  });
  app.use("/uploads", express.static("uploads"));
  await server.start();

  app.use(
    "/graphql",
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization || "";
        if (!auth.startsWith("Bearer ")) return { user: null };
        const token = auth.replace("Bearer ", "");
        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          return { user: decoded };
        } catch {
          throw new AuthError("Invalid token or expired", 401);
        }
      },
    }),
  );
app.use(express.json());
  app.get("/hello", (req, res) => {
    res.send("Dockerized with Node.js and GraphQL");
  });

  app.post("/kafka-endpoint", (req, res) => {
    console.log("Received data:", req.body);
    sendMessage("test-topic-1", JSON.stringify(req.body)); 
    res.json({ message: "Data received successfully", data: req.body });
  });


  async function sendMessage(topic, message) {
  await producer.connect();
  console.log("Producer connected");

  try {
  await producer.send({
    topic,
    messages: [{ key: "node-kafka", value: message }],
  });


  console.log(`Message sent → ${message}`);
  } catch (error) {
    console.error("Error sending message:", error);
  }
  await producer.disconnect();
}


  try {
    await mongoose.connect('mongodb+srv://node-graphql-demo:ip9qMCtjy8g4Kadr@anvtdemo.habtrf3.mongodb.net/node-graphql-demo-db?appName=AnvtDemo');
    console.log("MongoDB Connected successfully");
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }

  app.listen(8080, () => {
    console.log("🚀 Server ready at http://localhost:8080/graphql");
  });
}

start();
