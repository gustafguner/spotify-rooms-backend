import * as mongoose from 'mongoose';

export interface IRoom extends mongoose.Document {
  name: string;
}
