import { Router } from "express";
import passport from "../config/passport.js";
import prisma from "../queries.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import formatBytes from '../helpers/formatBytes.js';

const upload = multer({ dest: './public/data/uploads/' })

const indexRouter = Router();

indexRouter.get("/", async(req, res) => {
    try {
        const folderid = null;
        const folder = {
            id : null,
            user_id : res.locals.user_id,
            folder_id : null,
            name : 'Documents'
        }
        const content = await prisma.getcontentbyfolder_id(folderid);
        res.render("folder", {user_id: res.locals.user_id, folder: folder, content: content});
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

indexRouter.post("/uploadfile", upload.single('uploaded_file'), async (req, res) => {
    try {
        console.log(req.file, req.body);
        const {originalname, size} = req.file;
        const Size = formatBytes(size);
        const upload_time = new Date().toLocaleString();
        console.log(res.locals.user_id, res.locals.id, originalname, Size, upload_time);
        await prisma.addfile(res.locals.user_id, res.locals.id, originalname, Size, upload_time);

        if (res.locals.id === null) {
            res.redirect('/');
        } else {
            res.redirect(`/folder/${res.locals.id}`);
        }
    } catch (error) {
        console.error(error);
    }
})

indexRouter.post("/folder", async(req, res) => {
    try {
        const { foldername } = req.body;
        console.log(res.locals.user_id, res.locals.id, foldername);
        await prisma.addfolder(res.locals.user_id, res.locals.id, foldername);
        if (res.locals.id === null) {
            res.redirect('/');
        } else {
            res.redirect(`/folder/${res.locals.id}`);
        }
    } catch (error) {
        console.error(error);
    }
});

indexRouter.get("/folder/:folderid", async(req, res) => {
    const { folderid } = req.params;
    const folder = await prisma.getfolderbyid(folderid);
    const content = await prisma.getcontentbyfolder_id(folderid);
    res.render("folder", {user_id: res.locals.user_id, folder: folder, content: content});
});

indexRouter.get("/file/:fileid", async(req, res) => {
    const { fileid } = req.params; 
    const id = parseInt(fileid);
    const file = await prisma.getfilebyid(id);
    console.log(file);
    res.render("file", {file: file});
});

export default indexRouter;

