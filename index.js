const express = require("express");
const cors = require("cors");
const Redis = require("redis");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const redisClient = Redis.createClient();

app.get("/users", async (req, res) => {
  try {
    const x = redisClient.GET(
      "responseData",
      async (clientError, responseData) => {
        console.log("i am inside");
        if (clientError) {
          console.log("client error");
          return res.status(400).json({
            message: "There was an error in redis client",
            data: [],
          });
        }
        if (responseData !== null) {
          console.log("cached data", responseData);
          return res.status(200).json({
            data: responseData,
          });
        } else {
          const response = await axios.get(
            "https://jsonplaceholder.typicode.com/users"
          );
          const responseData = response.data;
          // caching the data
          redisClient.SETEX("responseData", 20, JSON.stringify(responseData));
          return res.status(200).json({
            data: responseData,
            error: "",
          });
        }
      }
    );
    return res.status(200).json({
      x,
    });
  } catch (err) {
    console.error("i was inside error");
    console.error(err);
    return res.status(400).json({
      data: [],
      error: err,
    });
  }
});

app.listen(4000, () => {
  redisClient
    .connect()
    .then(() => {
      console.log("listening to PORT 4000");
    })
    .catch((err) => {
      console.error(err);
      console.error("there was an error while listening");
    });
});
