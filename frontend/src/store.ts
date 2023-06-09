import { atom } from "recoil";

export const profileHandlesState = atom({
  key: "handles",
  default:[""], 
});

export const selectedHandleState = atom({
  key: "handle",
  default: 0, 
});