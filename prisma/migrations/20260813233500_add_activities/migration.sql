-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Activity_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "CollectionRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Activity_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "Activity" ("id", "requestId", "residentId", "type", "message", "createdAt")
SELECT
  'act_' || "id",
  "id",
  "residentId",
  'SUBMITTED',
  'Collection request submitted — ' || "address",
  "createdAt"
FROM "CollectionRequest";
