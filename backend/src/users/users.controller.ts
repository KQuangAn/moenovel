import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('create')
  createUser(@Body('clerkId') clerkId: string) {
    return this.usersService.createUser(clerkId);
  }

  @Get(':clerkId')
  getUser(@Param('clerkId') clerkId: string) {
    return this.usersService.getUser(clerkId);
  }

  @Patch('preferences/:clerkId')
  updatePreferences(@Param('clerkId') clerkId: string, @Body() preferences: any) {
    return this.usersService.updatePreferences(clerkId, preferences);
  }

  @Post('reading-history/:clerkId')
  addReadingHistory(@Param('clerkId') clerkId: string, @Body('bookId') bookId: string) {
    return this.usersService.addReadingHistory(clerkId, bookId);
  }
}
