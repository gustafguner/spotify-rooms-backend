import * as mongoose from 'mongoose';

export interface ISpot extends mongoose.Document {
  name: string;
  somethingElse?: number;
}
