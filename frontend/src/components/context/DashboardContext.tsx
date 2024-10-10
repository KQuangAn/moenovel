'use client';

import { BooksWithoutNT, PurchasedBook } from '@/types/book.types';
import { ForumPost } from '@/types/forumPost.types';
import { createContext } from 'react';

type DashboardContextProps = {
  children: React.ReactNode;
  values: DashboadContext;
};

type DashboadContext = {
  user: {
    userId: string;
    name: string;
    userImage: string;
  };
  isAuthor: boolean;
  author?: {
    name?: string;
    image?: string | null;
  };
  authorBooks?: BooksWithoutNT;
  purchases: PurchasedBook[];
  forumPosts: ForumPost[];
};

export const MyDashboardContext = createContext<DashboadContext>({
  user: {
    name: '',
    userId: '',
    userImage: '',
  },
  isAuthor: false,
  author: undefined,
  authorBooks: undefined,
  purchases: [],
  forumPosts: [],
});

export function DashboardContext({ children, values }: DashboardContextProps) {
  return <MyDashboardContext.Provider value={values}>{children}</MyDashboardContext.Provider>;
}
