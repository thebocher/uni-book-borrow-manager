import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  providers: [{ provide: APP_GUARD, useClass: RolesGuard }],
  imports: [UsersModule]
})
export class CommonModule {}
