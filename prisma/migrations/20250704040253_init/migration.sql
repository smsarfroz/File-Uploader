-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "content" VARCHAR(255) NOT NULL,
    "author" VARCHAR(255) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
