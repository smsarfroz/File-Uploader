import prisma from "./index.ts";

async function adduser(username, password) {
  try {
    const user = await prisma.users.create({
        data: {
            username: username,
            password: password,
        },
    })
    console.log(user);
  } catch(error) {
    console.error(error);
  }
}

export default {
    adduser,
}