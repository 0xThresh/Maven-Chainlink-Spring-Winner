import { apolloClient } from './apollo-client';
import { ProfileDocument, SingleProfileQueryRequest } from './graphql/generated';

const getProfileRequest = async (request: SingleProfileQueryRequest): Promise<any> => {
  const result = await apolloClient.query({
    query: ProfileDocument,
    variables: {
      request,
    },
  });

  return result.data.profile;
};

export const profile = async (profileId: string) => {
  if (!profileId) {
    throw new Error('Profile ID not provided');
  }

  const request: SingleProfileQueryRequest = {
    profileId,
  };

  const profile = await getProfileRequest(request);

  console.log(profile);

  // Returns the JSON block for easier parsing by external adapter 
  return profile;
};
