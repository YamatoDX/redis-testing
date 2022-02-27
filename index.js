const express = require("express")
const cors = require("cors")
const Redis = require("redis")
const axios = require("axios")

const app = express()
app.use(cors())
app.use(express.json())

const redisClient = Redis.createClient()

app.get("/users", )