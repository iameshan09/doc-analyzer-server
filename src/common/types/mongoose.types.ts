import { PopulateOptions, Types } from 'mongoose';

// Flexible populate options for Mongoose queries
type CustomPopulateOptions = PopulateOptions | (string | PopulateOptions)[];

// Plain JavaScript object with MongoDB metadata fields
type MongoPlainJsObject<T> = T & {
  _id: Types.ObjectId; // MongoDB document ID
  __v?: number; // Version key for optimistic concurrency
};

export type { CustomPopulateOptions, MongoPlainJsObject };
