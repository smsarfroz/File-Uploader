import path from "node:path";
import express from "express";
import passport from "./config/passport.js";
import indexRouter from './routes/indexRouter.js';
import getSessionMiddleware from "./config/session.js";

const app = express();
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(getSessionMiddleware);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(async(req, res, next) => {
    // console.log(req.user);
    console.log("locals information");
    const { id } = req.params;
    if (req.user) {
        res.locals.currentUser = req.user.username;
        res.locals.user_id = req.user.id;
    }
    if (id) {
      res.locals.id = id;
    } else {
      res.locals.id = null;
    }
    console.log(res.locals.currentUser, res.locals.user_id, res.locals.id);
    next();
});


app.use("/", indexRouter);

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
