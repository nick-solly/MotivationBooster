import { users, messages, type User, type InsertUser, type Message, type InsertMessage } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getRandomMessage(): Promise<Message | undefined>;
  getAllMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  seedMessages(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getRandomMessage(): Promise<Message | undefined> {
    const [message] = await db
      .select()
      .from(messages)
      .orderBy(sql`RANDOM()`)
      .limit(1);
    return message || undefined;
  }

  async getAllMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(sql`RANDOM()`).limit(10);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async seedMessages(): Promise<void> {
    const existingMessages = await db.select().from(messages).limit(1);
    if (existingMessages.length > 0) {
      return; // Already seeded
    }

    const seedData: InsertMessage[] = [
      {
        text: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
        author: "Steve Jobs"
      },
      {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
      },
      {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
      },
      {
        text: "It is during our darkest moments that we must focus to see the light.",
        author: "Aristotle"
      },
      {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney"
      },
      {
        text: "Don't let yesterday take up too much of today.",
        author: "Will Rogers"
      },
      {
        text: "You learn more from failure than from success. Don't let it stop you. Failure builds character.",
        author: "Unknown"
      },
      {
        text: "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.",
        author: "Steve Jobs"
      },
      {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
      },
      {
        text: "The only impossible journey is the one you never begin.",
        author: "Tony Robbins"
      },
      {
        text: "In the middle of difficulty lies opportunity.",
        author: "Albert Einstein"
      },
      {
        text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
        author: "Ralph Waldo Emerson"
      },
      {
        text: "Life is what happens to you while you're busy making other plans.",
        author: "John Lennon"
      },
      {
        text: "The future belongs to those who prepare for it today.",
        author: "Malcolm X"
      },
      {
        text: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson"
      }
    ];

    await db.insert(messages).values(seedData);
  }
}

export const storage = new DatabaseStorage();
