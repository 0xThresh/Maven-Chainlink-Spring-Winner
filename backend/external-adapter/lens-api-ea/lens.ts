// MUST BE RUN IN LENS-API-EXAMPLES UNTIL DEPENDENCIES ARE COPIED OVER
import { apolloClient } from '../apollo-client';
import { login } from '../authentication/login';
import { explicitStart, PROFILE_ID } from '../config';
import { getAddressFromSigner } from '../ethers.service';
import { ProfileDocument, SingleProfileQueryRequest } from '../graphql/generated';


// TODO: Make profile an argument instead of a config value 
const getProfileRequest = async (request: SingleProfileQueryRequest) => {
  const result = await apolloClient.query({
    query: ProfileDocument,
    variables: {
      request,
    },
  });

  return result.data.profile;
};

export const profile = async (request?: SingleProfileQueryRequest) => {
  const profileId = PROFILE_ID;
  if (!profileId) {
    throw new Error('Must define PROFILE_ID in the .env to run this');
  }

  const address = getAddressFromSigner();
  console.log('profiles: address', address);

  await login(address);

  if (!request) {
    request = { profileId: '0x8be0' };
  }

  const profile = await getProfileRequest(request);

  console.log('profile: result', profile);

  return profile;
};

// Need to set the custom profile below as it stands now
(async () => {
    if (explicitStart(__filename)) {
      await profile({ profileId: '0x8be0' });
    }
  })();
