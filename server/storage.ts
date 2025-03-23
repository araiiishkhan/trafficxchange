import { nanoid } from "nanoid";
import session from "express-session";
import createMemoryStore from "memorystore";
import { users, type User, type InsertUser, sessions, type Session, type InsertSession, urls, type Url, type InsertUrl } from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<void>;
  updateUserHits(userId: number, hits: number): Promise<void>;
  
  // Session methods
  getSessions(userId: number): Promise<Session[]>;
  getSession(id: number): Promise<Session | undefined>;
  getSessionByClientId(clientId: string): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSessionStatus(id: number, status: string): Promise<void>;
  updateSessionActivity(id: number, active: boolean): Promise<void>;
  updateSessionPoints(id: number, points: number): Promise<void>;
  updateSessionHits(id: number, hits: number): Promise<void>;
  
  // URL methods
  getUrls(userId: number): Promise<Url[]>;
  getUrl(id: number): Promise<Url | undefined>;
  createUrl(url: InsertUrl): Promise<Url>;
  updateUrlHits(id: number, hits: number): Promise<void>;
  updateUrlTodayHits(id: number, hits: number): Promise<void>;
  updateUrlPointsUsed(id: number, points: number): Promise<void>;
  updateUrlActivity(id: number, active: boolean): Promise<void>;
  deleteUrl(id: number): Promise<void>;
  
  // Session store for express-session
  sessionStore: any; // Using "any" for now to fix the type issue
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sessions: Map<number, Session>;
  private urls: Map<number, Url>;
  private userCurrentId: number;
  private sessionCurrentId: number;
  private urlCurrentId: number;
  sessionStore: any; // Using "any" for now to fix the type issue

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.urls = new Map();
    this.userCurrentId = 1;
    this.sessionCurrentId = 1;
    this.urlCurrentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const clientId = nanoid(12);
    const user: User = { 
      ...insertUser, 
      id, 
      clientId,
      points: 0,
      hits: 0
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(userId: number, points: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.points = points;
      this.users.set(userId, user);
    }
  }

  async updateUserHits(userId: number, hits: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.hits = hits;
      this.users.set(userId, user);
    }
  }

  // Session methods
  async getSessions(userId: number): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      (session) => session.userId === userId,
    );
  }

  async getSession(id: number): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async getSessionByClientId(clientId: string): Promise<Session | undefined> {
    return Array.from(this.sessions.values()).find(
      (session) => session.clientId === clientId,
    );
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.sessionCurrentId++;
    
    // Handle required and default values explicitly to fix type issues
    const session: Session = {
      id,
      clientId: insertSession.clientId,
      userId: insertSession.userId,
      points: 0,
      hits: 0,
      active: true,
      status: "Ready",
      note: insertSession.note || "",
      proxy: insertSession.proxy || "System",
      proxyConfig: insertSession.proxyConfig || null
    };
    
    this.sessions.set(id, session);
    return session;
  }

  async updateSessionStatus(id: number, status: string): Promise<void> {
    const session = this.sessions.get(id);
    if (session) {
      session.status = status;
      this.sessions.set(id, session);
    }
  }

  async updateSessionActivity(id: number, active: boolean): Promise<void> {
    const session = this.sessions.get(id);
    if (session) {
      session.active = active;
      session.status = active ? "Ready" : "Paused";
      this.sessions.set(id, session);
    }
  }

  async updateSessionPoints(id: number, points: number): Promise<void> {
    const session = this.sessions.get(id);
    if (session) {
      session.points = points;
      this.sessions.set(id, session);
    }
  }

  async updateSessionHits(id: number, hits: number): Promise<void> {
    const session = this.sessions.get(id);
    if (session) {
      session.hits = hits;
      this.sessions.set(id, session);
    }
  }

  // URL methods
  async getUrls(userId: number): Promise<Url[]> {
    return Array.from(this.urls.values()).filter(
      (url) => url.userId === userId,
    );
  }

  async getUrl(id: number): Promise<Url | undefined> {
    return this.urls.get(id);
  }

  async createUrl(insertUrl: InsertUrl): Promise<Url> {
    const id = this.urlCurrentId++;
    
    // Handle required and default values explicitly to fix type issues
    const url: Url = {
      id,
      userId: insertUrl.userId,
      url: insertUrl.url,
      minVisitTime: insertUrl.minVisitTime || 30, // Default to 30 seconds if not provided
      hits: 0,
      todayHits: 0,
      pointsUsed: 0,
      active: true,
      createdAt: new Date()
    };
    
    this.urls.set(id, url);
    return url;
  }

  async updateUrlHits(id: number, hits: number): Promise<void> {
    const url = this.urls.get(id);
    if (url) {
      url.hits = hits;
      this.urls.set(id, url);
    }
  }

  async updateUrlTodayHits(id: number, hits: number): Promise<void> {
    const url = this.urls.get(id);
    if (url) {
      url.todayHits = hits;
      this.urls.set(id, url);
    }
  }

  async updateUrlPointsUsed(id: number, points: number): Promise<void> {
    const url = this.urls.get(id);
    if (url) {
      url.pointsUsed = points;
      this.urls.set(id, url);
    }
  }

  async updateUrlActivity(id: number, active: boolean): Promise<void> {
    const url = this.urls.get(id);
    if (url) {
      url.active = active;
      this.urls.set(id, url);
    }
  }

  async deleteUrl(id: number): Promise<void> {
    this.urls.delete(id);
  }
}

export const storage = new MemStorage();
