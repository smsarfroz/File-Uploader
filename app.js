import path from "node:path";
import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import indexRouter from './routes/indexRouter.js';
import expressSession from 'express-session';
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from './generated/prisma/index.js';

const app = express();
const currentDir = import.meta.dirname;
const assetsPath = path.join(currentDir, "public");
app.use(express.static(assetsPath));
app.set("views", path.join(currentDir, "views"));
app.set("view engine", "ejs");

const prisma = new PrismaClient();
app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);
app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
