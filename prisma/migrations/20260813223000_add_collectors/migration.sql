-- CreateTable
CREATE TABLE "Collector" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CollectionRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "residentId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "wasteType" TEXT NOT NULL,
    "preferredDate" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "collectorId" TEXT,
    "collectorName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CollectionRequest_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CollectionRequest_collectorId_fkey" FOREIGN KEY ("collectorId") REFERENCES "Collector" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CollectionRequest" ("id", "residentId", "address", "wasteType", "preferredDate", "description", "status", "collectorName", "createdAt", "updatedAt") SELECT "id", "residentId", "address", "wasteType", "preferredDate", "description", "status", "collectorName", "createdAt", "updatedAt" FROM "CollectionRequest";
DROP TABLE "CollectionRequest";
ALTER TABLE "new_CollectionRequest" RENAME TO "CollectionRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
