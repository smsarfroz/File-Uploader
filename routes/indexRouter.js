import { Router } from "express";
import passport from "../config/passport.js";
import prisma from "../queries.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import formatBytes from '../helpers/formatBytes.js';
import supabase from "../config/supabaseClient.js";
import fs from 'fs';

const upload = multer({ dest: './public/data/uploads/' });

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
        // console.log(req.file, req.body);
        const {originalname, size, path} = req.file;
        const { folderid } = req.body;
        const folderidInt = parseInt(folderid);
        const Size = formatBytes(size);
        const upload_time = new Date().toLocaleString();
        const bucketname = 'files';
        const fileBuffer = fs.readFileSync(path);
        
        // console.log(fileBuffer);

        const { data, error } = await supabase.storage
            .from(bucketname)
            .upload(path, fileBuffer, {
                contentType: req.file.mimetype,
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return res.status(500).send('Error uploading to Supabase.');
        }

        const { data: publicUrlData } =  supabase.storage
            .from('files')
            .getPublicUrl(path);

        const publicUrl = publicUrlData.publicUrl;
        
        console.log(publicUrl);
        console.log('datatype of publicurl: ', typeof(publicUrl));
        // res.status(200).json({ message: 'File uploaded successfully', publicUrl});

        console.log(res.locals.user_id, folderidInt, originalname, Size, upload_time, publicUrl);
        const file = await prisma.addfile(res.locals.user_id, folderidInt, originalname, Size, upload_time, publicUrl);

        // console.log(file);

        if (folderidInt === null) {
            res.redirect('/');
        } else {
            res.redirect(`/folder/${folderidInt}`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    } finally {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
})

indexRouter.post("/folder", async(req, res) => {
    try {
        const { foldername, parentfolderid } = req.body;
        console.log('req.body', req.body);
        console.log('parentfolderid', parentfolderid);
        const folderidInt = parseInt(parentfolderid);
        console.log(res.locals.user_id, folderidInt, foldername);
        await prisma.addfolder(res.locals.user_id, folderidInt, foldername);
        if (folderidInt === null) {
            res.redirect('/');
        } else {
            res.redirect(`/folder/${folderidInt}`);
        }
    } catch (error) {
        console.error(error);
    }
});

indexRouter.get("/folder/:folderid", async(req, res) => {
    try {
        const { folderid } = req.params;
        console.log('folderid', folderid);
        const id = parseInt(folderid);
        const folder = await prisma.getfolderbyid(id);
        const content = await prisma.getcontentbyfolder_id(id);
        console.log('folder', folder);
        console.log('content', content);
        res.render("folder", {user_id: res.locals.user_id, folder: folder, content: content});
    } catch (error) {
        console.error(error);
    }
});

indexRouter.get("/file/:fileid", async(req, res) => {
    try {
        const { fileid } = req.params; 
        const id = parseInt(fileid);
        const file = await prisma.getfilebyid(id);
        console.log(file);
        res.render("file", {file: file});
    } catch (error) {
        console.error(error);
    }
});

indexRouter.get("/file/:fileid/delete", async(req, res) => {
    try {
        const { fileid } = req.params; 
        const id = parseInt(fileid);
        const deletefile = await prisma.deletefilebyid(id);
        // console.log('deletefile', deletefile);
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
});

indexRouter.get("/folder/:folderid/delete", async(req, res) => {
    try {
        const { folderid } = req.params; 
        const id = parseInt(folderid);
        await prisma.deletefolderanditscontentsbyid(id);
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
});

export default indexRouter;

