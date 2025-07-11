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
        console.log(content);
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

async function addfile(user_id, folder_id, name, size, upload_time) {
    try {
        const file = await prisma.files.create({
            data : {
                user_id : user_id,
                folder_id : folder_id,
                name : name,
                size : size, 
                upload_time : upload_time
            }
        })
        return file;
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
    addfile
}
