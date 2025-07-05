import { Router } from "express";

const indexRouter = Router();

indexRouter.get("/", async(req, res) => res.render("index"));

indexRouter.get("/sign-up", async(req, res) => res.render("sign-up"));

indexRouter.post("/sign-up", async(req, res) => {
    res.redirect("/");
});

indexRouter.get("/login", async(req, res) => res.render("login"));
export default indexRouter;