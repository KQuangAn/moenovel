import { userSession } from '@/services/auth.services';
import { User } from '@clerk/nextjs/server';
import { getAuthorById } from '@/services/author.services';

import TabContent from '@/components/manage/TabContent';

export const revalidate = 0;

const ManagePage = async () => {
  const {
    id: userId,
    firstName,
    lastName,
    emailAddresses,
    username,
    imageUrl,
  } = (await userSession()) as User;
  const authorDetails = await getAuthorById(userId);

  return (
    <TabContent
      firstName={firstName!}
      lastName={lastName!}
      username={username!}
      email={emailAddresses[0].emailAddress}
      image={imageUrl}
      {...authorDetails}
    />
  );
};

export default ManagePage;
