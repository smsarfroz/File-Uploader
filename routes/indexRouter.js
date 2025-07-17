import { Router } from "express";
import passport from "../config/passport.js";
import prisma from "../queries.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import formatBytes from '../helpers/formatBytes.js';
import supabase from "../config/supabaseClient.js";
import fs from 'fs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import path from "node:path";
import Stream from "node:stream";
import { pipeline } from 'node:stream/promises';
import { Readable } from "node:stream";

const upload = multer({ dest: './public/data/uploads/' });

const indexRouter = Router();

indexRouter.get("/", async(req, res) => {
    try {
        const user_id = res.locals.user_id;
        const folderid = null;
        const folder = {
            id : null,
            user_id : res.locals.user_id,
            folder_id : null,
            name : 'Documents'
        }
        console.log(res.locals);
        const content = await prisma.getcontentbyfolder_id(folderid, user_id);
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
        console.log('path: ', path);
        const { data: publicUrlData } =  supabase.storage
            .from('files')
            .getPublicUrl(path);

        const publicUrl = publicUrlData.publicUrl;
        
        console.log(publicUrl);
        console.log('datatype of publicurl: ', typeof(publicUrl));
        // res.status(200).json({ message: 'File uploaded successfully', publicUrl});

        console.log(res.locals.user_id, folderidInt, originalname, Size, upload_time, publicUrl, path);
        const file = await prisma.addfile(res.locals.user_id, folderidInt, originalname, Size, upload_time, publicUrl, path);

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

indexRouter.get("/file/:fileid/download", async(req, res) => {
    try {
        const user_id = res.locals.user_id;
        const { fileid } = req.params; 
        const id = parseInt(fileid);
        const file = await prisma.getfilebyid(id, user_id);
        const URL = await prisma.getfileurlbyid(id);
        const path = await prisma.getfilepathbyid(id);

        const { data, error } = await supabase
            .storage
            .from('files')
            .download(path) 

        if (error) {
            console.error('Supabase download error');
            return res.status(500).send('error downloading the file');
        }
        if (!data) {
            return res.status(404).json({ error: 'file not found' });
        }
        res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
        res.setHeader("Content-Type", file.mime_type || "application/octet-stream");

        const buffer = await data.arrayBuffer();
        const stream = Readable.from(Buffer.from(buffer));

        stream.pipe(res);
    } catch (error) {
        console.error(error);
    }
});

indexRouter.post("/folder", async(req, res) => {
    try {
        const { foldername, parentfolderid } = req.body;
        console.log('req.body', req.body);
        console.log('parentfolderid', parentfolderid);
        let folderidInt = parseInt(parentfolderid);
        if (parentfolderid === '') {
            folderidInt = null;
        }
        console.log(res.locals.user_id, folderidInt, foldername);
        await prisma.addfolder(res.locals.user_id, folderidInt, foldername);
        if (folderidInt == null) {
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
        const user_id = res.locals.user_id;
        const { folderid } = req.params;
        let id = parseInt(folderid);
        let folder = {
            id : null,
            user_id : res.locals.user_id,
            folder_id : null,
            name : 'Documents'
        }
        if (!Number.isNaN(id)) {
            folder = await prisma.getfolderbyid(id, user_id);
        }
        const content = await prisma.getcontentbyfolder_id(id, user_id);
        console.log('folder', folder);
        console.log('content', content);
        res.render("folder", {user_id: res.locals.user_id, folder: folder, content: content});
    } catch (error) {
        console.error(error);
    }
});

indexRouter.get("/file/:fileid", async(req, res) => {
    try {
        const user_id = res.locals.user_id; 
        const { fileid } = req.params; 
        const id = parseInt(fileid);
        const file = await prisma.getfilebyid(id, user_id);
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

