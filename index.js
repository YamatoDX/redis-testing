const express = require("express");
const cors = require("cors");
const Redis = require("redis");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const redisClient = Redis.createClient();

app.get("/users", (req, res) => {
  redisClient.get("responseData", async (error, data) => {
    if (error) {
      console.error(err);
      res.json({
        data: err,
      });
    }
    if (data !== null) {
      res.json({
        data,
      });
    }
    const apiResponse = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    const apiData = apiResponse.data;
    redisClient.setEx("responseData", 10, JSON.stringify(apiData));
    res.json({
      data: apiData,
    });
  });
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
