-- CreateEnum
CREATE TYPE "user_type" AS ENUM ('company', 'organization');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('active', 'pending', 'invited', 'suspended');

-- CreateEnum
CREATE TYPE "organization_role" AS ENUM ('代表', '副代表', '広報', '財務', 'メンバー');

-- CreateEnum
CREATE TYPE "organization_member_status" AS ENUM ('active', 'pending', 'invited');

-- CreateEnum
CREATE TYPE "tag_type" AS ENUM ('industry', 'feature', 'university');

-- CreateEnum
CREATE TYPE "sponsorship_type" AS ENUM ('金銭協賛', '物品提供', 'メンタリング', 'イベント共催');

-- CreateEnum
CREATE TYPE "proposal_status" AS ENUM ('申請済み', '審査中', '承認済み', '却下');

-- CreateEnum
CREATE TYPE "chat_sender_type" AS ENUM ('user', 'company');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "user_type" "user_type" NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "status" "user_status" NOT NULL DEFAULT 'pending',
    "last_active_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "user_id" UUID NOT NULL,
    "university_email" VARCHAR(255),
    "university_name" VARCHAR(100),
    "phone" VARCHAR(20),
    "avatar_url" VARCHAR(500),
    "bio" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "tagline" VARCHAR(300),
    "description" TEXT,
    "join_code" VARCHAR(20) NOT NULL,
    "campus" VARCHAR(100),
    "representative_user_id" UUID,
    "contact_email" VARCHAR(255) NOT NULL,
    "contact_phone" VARCHAR(20),
    "logo_url" VARCHAR(500),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_members" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "organization_role" NOT NULL,
    "status" "organization_member_status" NOT NULL,
    "joined_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "organization_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "logo_url" VARCHAR(500),
    "hero_image_url" VARCHAR(500),
    "philosophy" TEXT,
    "rating_score" DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    "rating_count" INTEGER NOT NULL DEFAULT 0,
    "primary_contact_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_contacts" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "user_id" UUID,
    "name" VARCHAR(100) NOT NULL,
    "role" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "company_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" UUID NOT NULL,
    "type" "tag_type" NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_tags" (
    "company_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_tags_pkey" PRIMARY KEY ("company_id","tag_id")
);

-- CreateTable
CREATE TABLE "sponsorship_plans" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "summary" TEXT,
    "image_url" VARCHAR(500),
    "coverage_area" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "sponsorship_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsorship_plan_types" (
    "plan_id" UUID NOT NULL,
    "sponsorshipType" "sponsorship_type" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sponsorship_plan_types_pkey" PRIMARY KEY ("plan_id","sponsorshipType")
);

-- CreateTable
CREATE TABLE "sponsorship_conditions" (
    "company_id" UUID NOT NULL,
    "cash_support_available" BOOLEAN NOT NULL DEFAULT false,
    "cash_support_detail" TEXT,
    "goods_support_available" BOOLEAN NOT NULL DEFAULT false,
    "goods_support_detail" TEXT,
    "mentoring_available" BOOLEAN NOT NULL DEFAULT false,
    "mentoring_detail" TEXT,
    "cohost_event_available" BOOLEAN NOT NULL DEFAULT false,
    "cohost_event_detail" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "sponsorship_conditions_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "organization_name" VARCHAR(200) NOT NULL,
    "event_name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "logo_url" VARCHAR(500),
    "achievement_date" DATE,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposals" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "plan_id" UUID,
    "message" TEXT NOT NULL,
    "status" "proposal_status" NOT NULL,
    "submitted_by_user_id" UUID,
    "submitted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMPTZ(6),
    "reviewed_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_rooms" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "proposal_id" UUID,
    "last_message_at" TIMESTAMPTZ(6),
    "organization_unread_count" INTEGER NOT NULL DEFAULT 0,
    "company_unread_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "chat_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" UUID NOT NULL,
    "chat_room_id" UUID NOT NULL,
    "sender_type" "chat_sender_type" NOT NULL,
    "sender_user_id" UUID,
    "sender_contact_id" UUID,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kept_companies" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "kept_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kept_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "browsed_companies" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "browsed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "browsed_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regions" (
    "id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_status" ON "users"("status");

-- CreateIndex
CREATE INDEX "idx_users_type" ON "users"("user_type");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_university_email_key" ON "user_profiles"("university_email");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_join_code_key" ON "organizations"("join_code");

-- CreateIndex
CREATE INDEX "idx_organizations_join_code" ON "organizations"("join_code");

-- CreateIndex
CREATE INDEX "idx_organizations_representative" ON "organizations"("representative_user_id");

-- CreateIndex
CREATE INDEX "idx_org_members_org_user" ON "organization_members"("organization_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_org_members_status" ON "organization_members"("status");

-- CreateIndex
CREATE UNIQUE INDEX "organization_members_organization_id_user_id_key" ON "organization_members"("organization_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "companies_primary_contact_id_key" ON "companies"("primary_contact_id");

-- CreateIndex
CREATE INDEX "idx_companies_rating" ON "companies"("rating_score", "rating_count");

-- CreateIndex
CREATE INDEX "idx_companies_created" ON "companies"("created_at");

-- CreateIndex
CREATE INDEX "idx_company_contacts_company" ON "company_contacts"("company_id");

-- CreateIndex
CREATE INDEX "idx_company_contacts_primary" ON "company_contacts"("company_id", "is_primary");

-- CreateIndex
CREATE INDEX "idx_company_contacts_user" ON "company_contacts"("user_id");

-- CreateIndex
CREATE INDEX "idx_tags_type" ON "tags"("type", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "tags_type_label_key" ON "tags"("type", "label");

-- CreateIndex
CREATE INDEX "idx_company_tags_company" ON "company_tags"("company_id");

-- CreateIndex
CREATE INDEX "idx_company_tags_tag" ON "company_tags"("tag_id");

-- CreateIndex
CREATE INDEX "idx_sponsorship_plans_company" ON "sponsorship_plans"("company_id", "is_active");

-- CreateIndex
CREATE INDEX "idx_achievements_company" ON "achievements"("company_id", "display_order");

-- CreateIndex
CREATE INDEX "idx_proposals_organization" ON "proposals"("organization_id", "status");

-- CreateIndex
CREATE INDEX "idx_proposals_company" ON "proposals"("company_id", "status");

-- CreateIndex
CREATE INDEX "idx_proposals_submitted" ON "proposals"("submitted_at");

-- CreateIndex
CREATE UNIQUE INDEX "proposals_organization_id_company_id_plan_id_key" ON "proposals"("organization_id", "company_id", "plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_rooms_proposal_id_key" ON "chat_rooms"("proposal_id");

-- CreateIndex
CREATE INDEX "idx_chat_rooms_org" ON "chat_rooms"("organization_id", "last_message_at");

-- CreateIndex
CREATE INDEX "idx_chat_rooms_company" ON "chat_rooms"("company_id", "last_message_at");

-- CreateIndex
CREATE UNIQUE INDEX "chat_rooms_organization_id_company_id_key" ON "chat_rooms"("organization_id", "company_id");

-- CreateIndex
CREATE INDEX "idx_chat_messages_room" ON "chat_messages"("chat_room_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_chat_messages_unread" ON "chat_messages"("chat_room_id", "read");

-- CreateIndex
CREATE INDEX "idx_kept_companies_org" ON "kept_companies"("organization_id", "kept_at");

-- CreateIndex
CREATE UNIQUE INDEX "kept_companies_organization_id_company_id_key" ON "kept_companies"("organization_id", "company_id");

-- CreateIndex
CREATE INDEX "idx_browsed_companies_org" ON "browsed_companies"("organization_id", "browsed_at");

-- CreateIndex
CREATE INDEX "idx_browsed_companies_company" ON "browsed_companies"("company_id", "browsed_at");

-- CreateIndex
CREATE UNIQUE INDEX "regions_code_key" ON "regions"("code");

-- CreateIndex
CREATE INDEX "idx_regions_display_order" ON "regions"("display_order");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_representative_user_id_fkey" FOREIGN KEY ("representative_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_primary_contact_id_fkey" FOREIGN KEY ("primary_contact_id") REFERENCES "company_contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_contacts" ADD CONSTRAINT "company_contacts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_contacts" ADD CONSTRAINT "company_contacts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_tags" ADD CONSTRAINT "company_tags_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_tags" ADD CONSTRAINT "company_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsorship_plans" ADD CONSTRAINT "sponsorship_plans_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsorship_plan_types" ADD CONSTRAINT "sponsorship_plan_types_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "sponsorship_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsorship_conditions" ADD CONSTRAINT "sponsorship_conditions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "sponsorship_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_submitted_by_user_id_fkey" FOREIGN KEY ("submitted_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_reviewed_by_user_id_fkey" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_contact_id_fkey" FOREIGN KEY ("sender_contact_id") REFERENCES "company_contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kept_companies" ADD CONSTRAINT "kept_companies_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kept_companies" ADD CONSTRAINT "kept_companies_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "browsed_companies" ADD CONSTRAINT "browsed_companies_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "browsed_companies" ADD CONSTRAINT "browsed_companies_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

