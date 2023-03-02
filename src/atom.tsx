import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const keywordState = atom({
  key: "keyword",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const idState = atom({
  key: "id",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});
