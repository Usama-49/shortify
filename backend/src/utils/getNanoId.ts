import { nanoid } from "nanoid";

export const getNanoId = (len: number) => {
  return nanoid(len);
};
