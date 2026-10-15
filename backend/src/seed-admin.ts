import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { UserRole } from './users/entities/user.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const username = process.env.SEED_ADMIN_USERNAME;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!username || !password) {
    console.error('Set SEED_ADMIN_USERNAME and SEED_ADMIN_PASSWORD before running this script.');
    await app.close();
    process.exit(1);
  }

  try {
    const user = await usersService.create({ username, password, role: UserRole.ADMIN });
    console.log(`Admin user created: ${user.username} (id ${user.id})`);
  } catch (err) {
    console.error('Could not create admin user:', (err as Error).message);
  }

  await app.close();
}

bootstrap();
