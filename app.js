import path from "node:path";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import indexRouter from './routes/indexRouter.js';

const app = express();
const currentDir = import.meta.dirname;
const assetsPath = path.join(currentDir, "public");
app.use(express.static(assetsPath));
app.set("views", path.join(currentDir, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("index.ejs"));

app.listen(3000, () => console.log("app listening on port 3000!"));