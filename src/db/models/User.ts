import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String },
    fullname: { type: String },
    email: { type: String },
    location: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
