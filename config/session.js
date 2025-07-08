import session from 'express-session';
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient();

const sessionStore = new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000,  //ms
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }
);

sessionStore.on('error', (error) => {
  console.error('Session store error:', error);
});

const getSessionMiddleware = session({
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000 // ms
  },
  secret: process.env.SESSION_SECRET || 'fallback-session-secret',
  resave: true,
  saveUninitialized: true,
  store: sessionStore
});

export default getSessionMiddleware;