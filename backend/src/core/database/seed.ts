import { config } from 'dotenv';

config({ path: '../.env'})

import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { DataSource } from "typeorm";
import { Author } from 'src/modules/authors/models/author.model';
import { Book } from 'src/modules/books/models/book.model';
import { User } from 'src/modules/users/models/user.model';
import { Borrowing } from 'src/modules/borrowings/models/borrowing.model';
import { Role } from 'src/modules/users/enums/role.enum';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const dataSource = app.get(DataSource);

    await dataSource.manager.transaction(async (manager) => {
        console.log('--- Seeding Started ---');

        // 1. Create Authors
        const author1 = manager.create(Author, { name: 'J.K. Rowling', bio: 'British author.' });
        const author2 = manager.create(Author, { name: 'J.R.R. Tolkien', bio: 'English writer.' });
        await manager.save([author1, author2]);

        // 2. Create Books (Linking to Authors)
        const book1 = manager.create(Book, { 
            title: 'Harry Potter', 
            description: 'A wizarding world.', 
            stock: 10,
            authors: [author1] 
        });
        const book2 = manager.create(Book, { 
            title: 'The Hobbit', 
            description: 'There and back again.', 
            stock: 5,
            authors: [author2] 
        });
        await manager.save([book1, book2]);

        // 3. Create Users
        const user1 = manager.create(User, { 
            username: 'admin', 
            passwordHash: '$2b$12$Efji25geKU60xHFHnXSpuuGvJXGkSV93lHG2x26lVn066nVSCioXC', //123 
            role: Role.admin,
        });
        const user2 = manager.create(User, { 
            username: 'manager', 
            passwordHash: '$2b$12$Efji25geKU60xHFHnXSpuuGvJXGkSV93lHG2x26lVn066nVSCioXC', // 123
            role: Role.manager,
        });
        const user3 = manager.create(User, { 
            username: 'user', 
            passwordHash: '$2b$12$Efji25geKU60xHFHnXSpuuGvJXGkSV93lHG2x26lVn066nVSCioXC', // 123
            role: Role.user,
        });
        await manager.save([user1, user2, user3]);

        // 4. Create Borrowing Records
        // Note: Composite Primary Keys are used here (date, userId, bookId)
        const borrowing1 = manager.create(Borrowing, {
            dateBorrowed: new Date(),
            user: user1,
            book: book1,
            userId: user1.id, // Ensure IDs are set if BaseEntity doesn't handle it immediately
            bookId: book1.id,
            isReturned: false
        });

        const borrowing2 = manager.create(Borrowing, {
            dateBorrowed: new Date(),
            user: user2,
            book: book2,
            userId: user2.id,
            bookId: book2.id,
            isReturned: true
        });

        await manager.save([borrowing1, borrowing2]);

        console.log('--- Seeding Completed Successfully ---');
    });
    
    process.exit();
}
bootstrap();