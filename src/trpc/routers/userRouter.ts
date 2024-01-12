import { z } from 'zod';
import { privateProcedure, router } from '../trpc';
import { getBookById } from '@/services/books.services';
import getUrl from '@/utils/getUrl';
import { TRPCError } from '@trpc/server';
import { getUserPurchases } from '@/services/user.services';
import { DrizzleError } from 'drizzle-orm';
import { stripe } from '@/lib/payments/stripeServer';

export const userRouter = router({
  purchaseBook: privateProcedure
    .input(z.string().min(2, { message: 'Enter a valid id' }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const bookId = input;

      try {
        const book = await getBookById(bookId);

        if (!book || !book.id) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No book found associated with the id',
          });
        }

        if (book.status === 'draft' || book.availability === 'Free') {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You cannot purchase this book',
          });
        }

        const billingUrl = getUrl(`/books/${book.id}`);

        const purchases = await getUserPurchases(user.id);

        if (!purchases?.userId) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong',
          });
        }

        const { purchasedBooks } = purchases;

        if (purchasedBooks?.includes(book.id)) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'You have already purchased this book',
          });
        }

        const createStripeSession = await stripe.checkout.sessions.create({
          success_url: billingUrl,
          cancel_url: billingUrl,
          payment_method_types: ['card'],
          mode: 'payment',
          billing_address_collection: 'auto',
          line_items: [
            {
              price_data: {
                product_data: {
                  name: book.bookTitle,
                  images: [book.frontArtwork?.replace('|', '%7c')!],
                  description:
                    'Purchasing the book will grant user unlimited reading access of the book for lifetime',
                  metadata: {
                    bookId: book.id,
                  },
                },
                unit_amount: Number(book.pricing) * 100 * 82,
                currency: 'INR',
              },
              quantity: 1,
            },
          ],
          metadata: {
            userId: user.id,
            bookId: book.id,
          },
        });

        if (!createStripeSession || !createStripeSession.url) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong during purchase',
          });
        }

        return {
          url: createStripeSession.url,
          sessionId: createStripeSession.id,
        };
      } catch (err) {
        console.error('[PURCHASE_BOOK_ERROR]:', err);

        if (err instanceof z.ZodError) {
          throw new TRPCError({
            code: 'PARSE_ERROR',
            message: 'Data passed in incorrect format',
          });
        }
        if (err instanceof DrizzleError) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to make changes to the db',
          });
        }
        if (err instanceof TRPCError) {
          throw new TRPCError({
            code: err.code,
            message: err.message,
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
        });
      }
    }),
});
