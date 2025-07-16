import prisma from "./index.js";

async function adduser(username, password) {
    try {
        const user = await prisma.users.create({
            data: {
                username: username,
                password: password,
            },
        });
        // console.log(user);
    }
    catch (error) {
        console.error(error);
    }
}

async function getcontentbyfolder_id(id) {
    try {
        const folders = await prisma.folders.findMany({
            where: {
                folder_id: id
            }
        })
        const files = await prisma.files.findMany({
            where: {
                folder_id: id
            }
        })
        const content = [...folders, ...files];
        // console.log(content);
        return content;
    } catch (error) {
        console.error(error);
    }
}

async function getfolderbyid(id) {
    try {
        const folder = await prisma.folders.findUnique({
            where : {
                id : id
            }
        })
        return folder;
    } catch (error) {
        console.error(error);
    }
}

async function getfilebyid(id) {
    try {
        const file = await prisma.files.findUnique({
            where : {
                id : id
            }
        })
        return file;
    } catch (error) {
        console.error(error);
    }
}

async function addfolder(user_id, folder_id, name) {
    try {
        const folder = await prisma.folders.create({
            data : {
                user_id : user_id,
                folder_id : folder_id,
                name : name
            }
        })
    } catch (error) {
        console.error(error);
    }
}

async function addfile(user_id, folder_id, name, size, upload_time, publicUrl, path) {
    try {
        const file = await prisma.files.create({
            data : {
                user_id : user_id,
                folder_id : folder_id,
                name : name,
                size : size, 
                upload_time : upload_time,
                URL: publicUrl,
                path: path
            }
        })
        return file;
    } catch (error) {
        console.error(error);
    }
}

async function deletefilebyid(id) {
    try {
        const deletefile = await prisma.files.delete({
            where: {
                id: id,
            },
        })
        return deletefile;
    } catch (error) {
        console.error(error);
    }
}

async function deletefolderanditscontentsbyid(id) {
    try {
        const deletecontent = await prisma.files.deleteMany({
            where: {
                folder_id: id
            }
        })
        const deletefolder = await prisma.folders.delete({
            where: {
                id: id
            }
        })
        // console.log('deletecontent', deletecontent);
        // console.log('deletefolder', deletefolder);
    } catch (error) {
        console.error(error);
    }
}

async function getfileurlbyid(id) {
    try {
        const file = await getfilebyid(id);
        console.log('file: ', file);
        const URL = file.URL;
        return URL;
    } catch (error) {
        console.error(error);
    }
}

async function getfilepathbyid(id) {
    try {
        const file = await getfilebyid(id);
        const path = file.path;
        return path;
    } catch (error) {
        console.error(error);
    }
}

export default {
    adduser,
    getcontentbyfolder_id,
    getfolderbyid,
    getfilebyid,
    addfolder,
    addfile,
    deletefilebyid,
    deletefolderanditscontentsbyid,
    getfileurlbyid,
    getfilepathbyid
}
