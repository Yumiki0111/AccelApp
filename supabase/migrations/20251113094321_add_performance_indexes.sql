-- CreateIndex
CREATE INDEX "idx_companies_deleted" ON "companies"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_companies_name" ON "companies"("name");

-- CreateIndex
CREATE INDEX "idx_organizations_deleted" ON "organizations"("deleted_at");

