import express from "express";
import { authorize } from "./middleware";

const router = express.Router();

router.get("/api/posts", authorize, async (req, res) => {
  res.json("Get all posts");
});

router.get("/api/posts/:id", authorize, async (req, res) => {
  res.json("Get a post");
});

router.post("/api/posts", authorize, async (req, res) => {
  res.json("Create a post");
});

router.put("/api/posts/:id", authorize, async (req, res) => {
  res.json("Update a post");
});

router.delete("/api/posts/:id", authorize, async (req, res) => {
  res.json("Delete a post");
});

router.get("/api/users", authorize, async (req, res) => {
  res.json("Get all users");
});

export { router };
