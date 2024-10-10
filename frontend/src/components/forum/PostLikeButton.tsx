'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/TRPCProvider';
import { useRouter } from 'next/navigation';

import { ThumbsUp } from 'lucide-react';
import { cn } from '@/utils/utils';
import { toast } from 'sonner';

type PostLikeButtonProps = {
  postId: string;
  userId?: string | null;
  likes: string[];
  className?: string;
};

const PostLikeButton = ({
  className,
  postId,
  likes: initialLikes,
  userId,
}: PostLikeButtonProps) => {
  const [likes, setLikes] = useState<typeof initialLikes>(initialLikes);
  const utils = trpc.useUtils();
  const router = useRouter();

  const { mutate: likePost, isLoading } = trpc.forumPostRouter.like.useMutation({
    onMutate: async () => {
      const prevLikes = [...initialLikes];
      await utils.forumPostRouter.getPosts.cancel();

      if (!userId) {
        throw new Error('Not logged in', { cause: 401 });
      }

      if (!likes.includes(userId)) {
        setLikes((prev) => [...prev, userId]);
      } else {
        setLikes((prev) => prev.filter((item) => item !== userId));
      }

      return { prevLikes };
    },
    onSuccess: ({ success, msg }) => {
      if (success) {
        toast.success(msg);
      }
      utils.forumPostRouter.getPosts.invalidate();
    },
    onError: (err, _, prevData) => {
      console.error(err);
      setLikes(prevData?.prevLikes || initialLikes);

      utils.forumPostRouter.getPosts.invalidate();

      if (err.data?.code === 'UNAUTHORIZED' || (err instanceof Error && err.cause === 401)) {
        router.push('/login');
        return;
      }

      toast.error('Failed to like the post');
    },
  });

  return (
    <div className='flex items-center gap-3'>
      <button disabled={isLoading} onClick={() => likePost({ postId })}>
        <ThumbsUp
          className={cn(
            'h-4 w-4 cursor-pointer text-danger',
            {
              'fill-danger': likes.includes(userId || ''),
            },
            className
          )}
        />
      </button>
      <span className='text-xs text-danger'>{likes.length}</span>
    </div>
  );
};

export default PostLikeButton;
