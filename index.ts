import dotenv from "dotenv"
import express from "express"
import { prisma } from './lib/prisma'
dotenv.config()

const app = express()

app.use(express.json())

app.post("/create-user", async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ message: "Name is required" })
    }
    const user = await prisma.user.create({
      data: { name }
    })
    res.status(201).json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

app.post("/create-post", async (req, res) => {
  try {
    const { title, published, authorId } = req.body
    const user = await prisma.post.create({
      data: { title, published, authorId }
    })
    res.status(200).json({ message: "Post added successfully." })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

app.get("/get-post", async (req, res) => {
  try {
    const user = await prisma.post.findMany({ select: { title: true } })
    const totalPosts = await prisma.post.count();
    res.status(200).json({ data: user, totalPosts })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

app.get("/get-user", async (req, res) => {
  try {
    const user = await prisma.user.findMany({
      select: {
        name: true,
        post: {
          select: {
            title: true
          }
        }
      }
    })
    res.status(200).json({ data: user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

const PORT = Number(process.env.PORT) || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
