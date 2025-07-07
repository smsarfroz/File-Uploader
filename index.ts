import { PrismaClient } from './generated/prisma'

const prisma = new PrismaClient()

async function main() {
  const allMessages = await prisma.users.findMany();

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

export default prisma;