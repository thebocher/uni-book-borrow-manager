# Set up
1. Copy `.env.example` to `.env` in the root and set configurations
2. Run `docker compose up --build -d`
3. Run migrations: `docker compose exec backend npm run migration:run` 
4. Seed database: `docker compose exec backend npm run seed`
5. Done, application is working

Frontend port: 5173
Backend port: 3000