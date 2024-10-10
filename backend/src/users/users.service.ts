import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser, UserModel } from './entities/user.entity';

@Injectable()
export class UsersService {
  async createUser(clerkId: string): Promise<IUser> {
    const user = new UserModel({ clerkId });
    await user.save();
    return user;
  }

  async getUser(clerkId: string) {
    const user = await UserModel.findOne({ clerkId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updatePreferences(clerkId: string, preferences: any) {
    return UserModel.findOneAndUpdate({ clerkId }, { preferences }, { new: true });
  }

  async addReadingHistory(clerkId: string, bookId: string) {
    const user = await this.getUser(clerkId);
    user.readingHistory.push({ bookId, lastRead: new Date() });
    return user.save();
  }
}
