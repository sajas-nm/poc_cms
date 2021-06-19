import { Document } from "mongoose";
export interface IContact extends Document {
  name: string;
  contact_no: string;
  email: string;
  address: string;
}
