import { Router } from "express";
import passport from "passport";

const indexRouter = Router();

indexRouter.get("/", async(req, res) => res.render("index"));

indexRouter.get("/sign-up", async(req, res) => res.render("sign-up"));

indexRouter.post("/sign-up", async(req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        res.redirect("/");
    } catch (error) {
        console.error(error);
        next(error);
    }
});

indexRouter.get("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}));

indexRouter.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        res.redirect("/");
    })
})

export default indexRouter;