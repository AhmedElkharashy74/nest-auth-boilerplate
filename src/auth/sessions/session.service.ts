// src/sessions/sessions.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, token: string, expiresAt: Date) {
    return this.prisma.session.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.session.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByToken(token: string) {
    return this.prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.session.findMany({
      where: { userId, revoked: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async revoke(token: string) {
    return this.prisma.session.update({
      where: { token },
      data: { revoked: true },
    });
  }

  async revokeAllForUser(userId: string) {
    return this.prisma.session.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }

  async revokeById(sessionId: string) {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: { revoked: true },
    });
  }

  async deleteExpired() {
    return this.prisma.session.deleteMany({
      where: { 
        OR: [
          { expiresAt: { lt: new Date() } },
          { revoked: true }
        ]
      },
    });
  }

  async isValid(token: string): Promise<boolean> {
    const session = await this.findByToken(token);
    return !!session && 
           !session.revoked && 
           session.expiresAt > new Date();
  }
}