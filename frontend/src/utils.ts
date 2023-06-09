export const MAVEN_CONTRACT_ADDRESS = "0xcDf976a960d6F553011aA3195f3F87871f3fa25B";
export const ORACLE_CONTRACT_ADDRESS = "0xabEE66bB661F34c9C3766FF5bC3BABa83b120208";
export const EA_JOB_ID = "c89cd0852cf04f6b8e5bbd5da5841214";
export function formatPicture(picture: any) {
  if (picture.__typename === "MediaSet") {
    if (picture.original.url.startsWith("ipfs://")) {
      let result = picture.original.url.substring(7, picture.original.url.length);
      return `http://lens.infura-ipfs.io/ipfs/${result}`;
    } else if (picture.original.url.startsWith("ar://")) {
      let result = picture.original.url.substring(4, picture.original.url.length);
      return `http://arweave.net/${result}`;
    } else {
      return picture.original.url;
    }
  } else {
    return picture;
  }
}