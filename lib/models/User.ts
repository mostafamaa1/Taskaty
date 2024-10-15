// models/User.ts
import mongoose, { Schema, Document } from 'mongoose'; // Importing mongoose and its types

export interface IUser extends Document {
  name: string; // User's name
  email: string; // User's email
  password: string; // User's password
}

// Defining the UserSchema
const UserSchema: Schema = new Schema({
  name: {
    type: String, // Field type for name
    required: [true, "Fullname is required"], // Validation for name
    minLength: [3, "fullname must be at least 3 characters"], // Minimum length validation
    maxLength: [25, "fullname must be at most 25 characters"], // Maximum length validation
  },
  email: {
    type: String, // Field type for email
    unique: true, // Ensuring email is unique
    required: [true, "Email is required"], // Validation for email
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Email is invalid",
    ], // Email format validation
  },
  password: {
    type: String, // Field type for password
    required: [true, "Password is required"], // Validation for password
    select: false, // Excluding password from query results
  },
});

// Exporting the User model
export const UserModel =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
