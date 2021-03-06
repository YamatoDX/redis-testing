const express = require("express");
const cors = require("cors");
const axios = require("axios");
const Redis = require("redis");

const app = express();
app.use(cors());
app.use(express.json());

const redisClient = Redis.createClient({
  url:"redis://127.0.0.1:6379"
});

// works when redis server is running on a docker container

app.get("/users", async (req, res) => {
  try {
    const cachedValue = await redisClient.GET("responseData");
    if (!cachedValue) {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      const axiosData = response.data;
      await redisClient.setEx("responseData", 60, JSON.stringify(axiosData));
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
  await redisClient.connect();
  console.log("redis connected");
  console.log("listening to PORT 4000");
});
