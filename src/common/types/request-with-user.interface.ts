import { Request } from 'express';

type RequestWithUser<T> = Request & {
  user: T;
};

export type { RequestWithUser };
