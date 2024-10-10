import { Skeleton } from '@nextui-org/skeleton';

const ManageSkeleton = () => {
  return (
    <div className='w-[150x] space-y-3'>
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <Skeleton key={index} className='h-60 w-full rounded-lg' />
        ))}
    </div>
  );
};

export default ManageSkeleton;
