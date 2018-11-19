import * as mongoose from 'mongoose';

import { ISpot } from './interfaces/spot';

export const SpotSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Spot = mongoose.model<ISpot>('Spot', SpotSchema);
export default Spot;
