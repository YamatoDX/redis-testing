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
    const cachedValue = await redisClient.GET("responseData");
    if (!cachedValue) {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      const axiosData = response.data;
      await redisClient.setEx("responseData", 10, JSON.stringify(axiosData));
      return res.status(200).json({
        data: axiosData,
        error: "",
      });
    } else {
      return res.status(200).json({
        data: JSON.parse(cachedValue),
        error: "",
      });
    }
  } catch (err) {
    console.error(err);
    console.log("there was an error in the first catch block");
    return res.status(400).json({
      data: [],
      err,
    });
  }
});

app.listen(4000, async () => {
  try {
    await redisClient.connect();
    console.log("listening to PORT 4000");
  } catch (err) {
    console.error(err);
    console.error("there was an error while listening to PORT 4000");
  }
});
