import { Router } from "express";
import passport from "../config/passport.js";
import prisma from "../queries.js";
import bcrypt from "bcryptjs";
import multer from "multer";
const upload = multer({ dest: './public/data/uploads/' })

const indexRouter = Router();

indexRouter.get("/", async(req, res) => {
    try {
        res.render("index");
    } catch(error) {
        console.error(error);
        next( new Error(error));
    }
});

indexRouter.get("/sign-up", async(req, res) => {
    try {
        res.render("sign-up");
    } catch(error) {
        console.error(error);
        next( new Error(error));
    }
});

indexRouter.post("/sign-up", async(req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.adduser(username, hashedPassword);
        res.redirect("/");
    } catch (error) {
        console.error(error);
        next( new Error(error));
    }
});

indexRouter.get("/login", async(req, res) => res.render("login"));

indexRouter.post("/login", passport.authenticate("local", {
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

indexRouter.post("/uploadfile", upload.single('uploaded_file'), function (req, res) {
    console.log(req.file, req.body);
})

indexRouter.get("/folder/:folderid", async(req, res) => {
    const { folderid } = req.params;
    const folder = await prisma.getfolderbyid(folderid);
    const content = await prisma.getcontentbyfolder_id(folderid);
    res.render("", {folder: folder, content: content});
});

indexRouter.get("/file/:fileid", async(req, res) => {
    const { fileid } = req.params; 

});

export default indexRouter;