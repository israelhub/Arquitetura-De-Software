-- CreateTable
CREATE TABLE "atores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "dataNascimento" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "filmes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "generos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "filme_ator" (
    "filmeId" TEXT NOT NULL,
    "atorId" TEXT NOT NULL,

    PRIMARY KEY ("filmeId", "atorId"),
    CONSTRAINT "filme_ator_filmeId_fkey" FOREIGN KEY ("filmeId") REFERENCES "filmes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "filme_ator_atorId_fkey" FOREIGN KEY ("atorId") REFERENCES "atores" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "filme_genero" (
    "filmeId" TEXT NOT NULL,
    "generoId" TEXT NOT NULL,

    PRIMARY KEY ("filmeId", "generoId"),
    CONSTRAINT "filme_genero_filmeId_fkey" FOREIGN KEY ("filmeId") REFERENCES "filmes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "filme_genero_generoId_fkey" FOREIGN KEY ("generoId") REFERENCES "generos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "generos_nome_key" ON "generos"("nome");
