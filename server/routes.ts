import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertUrlSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Sessions routes
  app.get("/api/sessions", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    try {
      const sessions = await storage.getSessions(req.user!.id);
      res.json(sessions);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    try {
      const session = await storage.createSession({
        userId: req.user!.id,
        clientId: req.user!.clientId,
        proxy: req.body.proxy || "System",
        proxyConfig: req.body.proxyConfig,
        note: req.body.note || "",
      });
      res.status(201).json(session);
    } catch (err) {
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  app.put("/api/sessions/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    try {
      const sessionId = parseInt(req.params.id);
      const session = await storage.getSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      if (session.userId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      await storage.updateSessionStatus(sessionId, req.body.status);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Failed to update session status" });
    }
  });

  app.put("/api/sessions/:id/active", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    try {
      const sessionId = parseInt(req.params.id);
      const session = await storage.getSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      if (session.userId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      await storage.updateSessionActivity(sessionId, req.body.active);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Failed to update session activity" });
    }
  });

  // URL routes
  app.get("/api/urls", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    try {
      const urls = await storage.getUrls(req.user!.id);
      res.json(urls);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch URLs" });
    }
  });

  app.post("/api/urls", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    try {
      const urlData = insertUrlSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const url = await storage.createUrl(urlData);
      res.status(201).json(url);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid URL data", errors: err.errors });
      }
      res.status(500).json({ message: "Failed to create URL" });
    }
  });

  app.put("/api/urls/:id/active", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    try {
      const urlId = parseInt(req.params.id);
      const url = await storage.getUrl(urlId);
      
      if (!url) {
        return res.status(404).json({ message: "URL not found" });
      }
      
      if (url.userId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      await storage.updateUrlActivity(urlId, req.body.active);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Failed to update URL activity" });
    }
  });

  app.delete("/api/urls/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    try {
      const urlId = parseInt(req.params.id);
      const url = await storage.getUrl(urlId);
      
      if (!url) {
        return res.status(404).json({ message: "URL not found" });
      }
      
      if (url.userId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      await storage.deleteUrl(urlId);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete URL" });
    }
  });

  // Stats routes
  app.get("/api/stats", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    try {
      const user = req.user!;
      const sessions = await storage.getSessions(user.id);
      const urls = await storage.getUrls(user.id);
      
      const activeSessions = sessions.filter(s => s.active).length;
      const activeUrls = urls.filter(u => u.active).length;
      
      res.json({
        totalHits: user.hits,
        availablePoints: user.points,
        activeSessions,
        activeUrls
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Simulate traffic exchange API
  app.post("/api/exchange/register-hit", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    try {
      const { sessionId, urlId } = req.body;
      
      if (!sessionId || !urlId) {
        return res.status(400).json({ message: "Missing sessionId or urlId" });
      }
      
      const session = await storage.getSession(parseInt(sessionId));
      const url = await storage.getUrl(parseInt(urlId));
      
      if (!session || !url) {
        return res.status(404).json({ message: "Session or URL not found" });
      }
      
      // Update hits count
      await storage.updateSessionHits(session.id, session.hits + 1);
      await storage.updateUrlHits(url.id, url.hits + 1);
      await storage.updateUrlTodayHits(url.id, url.todayHits + 1);
      await storage.updateUserHits(req.user!.id, req.user!.hits + 1);
      
      // Update points (2 points earned per hit)
      const pointsEarned = 2;
      await storage.updateSessionPoints(session.id, session.points + pointsEarned);
      await storage.updateUserPoints(req.user!.id, req.user!.points + pointsEarned);
      await storage.updateUrlPointsUsed(url.id, url.pointsUsed + pointsEarned);
      
      res.json({ success: true, pointsEarned });
    } catch (err) {
      res.status(500).json({ message: "Failed to register hit" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
