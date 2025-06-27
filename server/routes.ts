import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed the database with initial messages
  await storage.seedMessages();

  // Get random message
  app.get("/api/messages/random", async (req, res) => {
    try {
      const message = await storage.getRandomMessage();
      if (!message) {
        return res.status(404).json({ message: "No messages found" });
      }
      res.json(message);
    } catch (error) {
      console.error("Error fetching random message:", error);
      res.status(500).json({ message: "Failed to fetch message" });
    }
  });

  // Get recent messages (for history)
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getAllMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
