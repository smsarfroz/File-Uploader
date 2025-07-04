import { PrismaClient } from './generated/prisma'

const prisma = new PrismaClient()

async function main() {
  await prisma.message.create({
    data: {
      content: "my first message",
      author: "sarfroz",
    },
  })

  const allMessages = await prisma.message.findMany();

  console.dir(allMessages, { depth: null });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })