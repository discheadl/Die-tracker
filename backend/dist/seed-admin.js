"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const users_service_1 = require("./users/users.service");
const user_entity_1 = require("./users/entities/user.entity");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const usersService = app.get(users_service_1.UsersService);
    const username = process.env.SEED_ADMIN_USERNAME;
    const password = process.env.SEED_ADMIN_PASSWORD;
    if (!username || !password) {
        console.error('Set SEED_ADMIN_USERNAME and SEED_ADMIN_PASSWORD before running this script.');
        await app.close();
        process.exit(1);
    }
    try {
        const user = await usersService.create({ username, password, role: user_entity_1.UserRole.ADMIN });
        console.log(`Admin user created: ${user.username} (id ${user.id})`);
    }
    catch (err) {
        console.error('Could not create admin user:', err.message);
    }
    await app.close();
}
bootstrap();
//# sourceMappingURL=seed-admin.js.map