import { userRoleLabels } from "@/lib/brand";

export type UserRole = keyof typeof userRoleLabels;

export interface SeedUser {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  passwordHash: string;
}

export const seedUsers: SeedUser[] = [
  {
    id: "usr-manager",
    username: "المدير",
    displayName: "المدير العام",
    role: "manager",
    passwordHash: "1513d53872d684b1a32a4c43171eaf06706476a2761675756b6673108ac7054b"
  },
  {
    id: "usr-accountant",
    username: "المحاسب",
    displayName: "المحاسب الرئيسي",
    role: "accountant",
    passwordHash: "21a1cf9e32e88c8c44fd2a9e0558a31a72cb06b0a6d41c9d7dadae59989372a9"
  }
];
