'use client';

import { trpc } from '@/lib/trpc/TRPCProvider';

import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/utils/utils';
import { useState } from 'react';

type StarsProps = {
  stars: number;
  length?: number;
  bookId?: string;
  displayOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const Stars = ({
  stars: initialStars,
  length = 5,
  bookId,
  displayOnly = false,
  size = 'md',
}: StarsProps) => {
  const [totalStars, setTotalStars] = useState(initialStars || 0);
  const utils = trpc.useUtils();

  const { mutate: rateBook, isLoading } = trpc.bookRouter.rateBook.useMutation({
    onMutate: async ({ stars }) => {
      const prevStars = initialStars;

      if (stars === totalStars) {
        setTotalStars(0);
      } else {
        setTotalStars(stars);
      }

      return { prevStars };
    },
    onSettled: (data) => {
      if (data?.success) {
        toast.success(data.msg);
      }
      utils.userRouter.purchases.invalidate();
    },
    onError: (_, _d, prevData) => {
      toast.error('Something went wrong while rating');

      if (prevData?.prevStars) {
        setTotalStars(prevData.prevStars);
      }
      utils.userRouter.purchases.invalidate();
    },
  });

  return (
    <>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <button
            key={index}
            disabled={isLoading}
            onClick={() => !displayOnly && bookId && rateBook({ bookId, stars: index + 1 })}
          >
            <Star
              className={cn('h-4 w-4 cursor-pointer text-warning', {
                'fill-warning': totalStars > index,
                'cursor-default': displayOnly,
                'h-3.5 w-3.5': size === 'sm',
                'h-6 w-6': size === 'lg',
              })}
            />
          </button>
        ))}
    </>
  );
};

export default Stars;
