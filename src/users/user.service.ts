// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private mapPrismaUserToEntity(prismaUser: any): User | null {
    if (!prismaUser) return null;
    
    return {
      id: prismaUser.id,
      email: prismaUser.email || undefined,
      username: prismaUser.username || undefined,
      password: prismaUser.password || undefined,
      name: prismaUser.name || undefined,
      image: prismaUser.image || undefined,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      roles: prismaUser.roles?.map((userRole: any) => ({
        id: userRole.role.id,
        name: userRole.role.name,
        permissions: userRole.role.RolePermission?.map((rp: any) => ({
          id: rp.permission.id,
          action: rp.permission.action,
          resource: rp.permission.resource
        })) || []
      })) || []
    };
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                RolePermission: { // Changed from 'permissions' to 'RolePermission'
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    
    return this.mapPrismaUserToEntity(user);
  }
  async upsertAccount(userId: string, accountData: {
    provider: string;
    providerAccountId: string;
    type: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
    }) {
    return this.prisma.account.upsert({
    where: {
    provider_providerAccountId: {
    provider: accountData.provider,
    providerAccountId: accountData.providerAccountId,
    },
    },
    update: {
    accessToken: accountData.accessToken,
    refreshToken: accountData.refreshToken,
    expiresAt: accountData.expiresAt,
    },
    create: {
    provider: accountData.provider,
    providerAccountId: accountData.providerAccountId,
    type: accountData.type,
    accessToken: accountData.accessToken,
    refreshToken: accountData.refreshToken,
    expiresAt: accountData.expiresAt,
    user: { connect: { id: userId } },
    },
    });
    }
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: {
              include: {
                RolePermission: { // Changed from 'permissions' to 'RolePermission'
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    
    return this.mapPrismaUserToEntity(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        roles: {
          include: {
            role: {
              include: {
                RolePermission: { // Changed from 'permissions' to 'RolePermission'
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    
    return this.mapPrismaUserToEntity(user);
  }

  async create(userData: {
    email?: string;
    username?: string;
    password?: string;
    name?: string;
    image?: string;
  }): Promise<User> {
    const user = await this.prisma.user.create({
      data: userData,
    });
    
    return this.mapPrismaUserToEntity(user) as User;
  }

  async setPassword(userId: string, password: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { password },
    });
  }
}