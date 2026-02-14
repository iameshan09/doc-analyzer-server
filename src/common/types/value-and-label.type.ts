import { Types } from 'mongoose';

type TValueAndLabel = {
  value: string | Types.ObjectId;
  label: string;
};

export default TValueAndLabel;
