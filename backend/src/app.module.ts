import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [BooksModule, UsersModule, CommentsModule, SearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
