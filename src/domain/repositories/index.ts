// リポジトリインターフェースのエクスポート
export type { CompanyRepository, CompanySearchParams, CompanyListResult, CompanyListItem, CompanyDetail } from './CompanyRepository';
export type { TagRepository, Tag } from './TagRepository';
export type { RegionRepository, Region } from './RegionRepository';
export type { OrganizationRepository, OrganizationProfile, OrganizationMember, OrganizationDashboard } from './OrganizationRepository';
export type { ProposalRepository, Proposal, CreateProposalParams } from './ProposalRepository';
export type { ChatRepository, ChatRoom, ChatMessage, CreateChatMessageParams } from './ChatRepository';
export type { AuthRepository, Session, UserWithSession } from './AuthRepository';

