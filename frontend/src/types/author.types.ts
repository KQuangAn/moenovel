import { bookGenres } from '@/config/constants/author';
import { authors } from '@/lib/db/schema';
import { getAuthorWithBooksById } from '@/services/author.services';

export type Author = (typeof authors)['$inferSelect'];

export type BookGenres = (typeof bookGenres)[number][];

export type SocialLinks = {
  twitter: string;
  instagram: string;
};

export type AuthorWithBooks = Awaited<ReturnType<typeof getAuthorWithBooksById>>;

export type AuthorByStars = {
  id: string;
  authorName: string;
  authorImage: string | null;
  stars: number;
};
