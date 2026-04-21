import { Injectable } from '@nestjs/common';
import { UserRepository } from '@saas-platform/identity-application';
import { AuthProvider, User } from '@saas-platform/identity-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<void> {
    const data = user.toPrimitives();

    await this.prisma.user.upsert({
      where: { id: data.id },
      update: {
        email: data.email,
        name: data.name,
        avatarUrl: data.avatarUrl,
        authProvider: data.authProvider,
        externalAuthId: data.externalAuthId,
        preferredTenantId: data.preferredTenantId,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        email: data.email,
        name: data.name,
        avatarUrl: data.avatarUrl,
        authProvider: data.authProvider,
        externalAuthId: data.externalAuthId,
        preferredTenantId: data.preferredTenantId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    return user ? this.toDomain(user) : null;
  }

  private toDomain(record: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    authProvider: string;
    externalAuthId: string | null;
    preferredTenantId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return User.create({
      id: record.id,
      email: record.email,
      name: record.name,
      avatarUrl: record.avatarUrl,
      authProvider: record.authProvider as AuthProvider,
      externalAuthId: record.externalAuthId,
      preferredTenantId: record.preferredTenantId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
