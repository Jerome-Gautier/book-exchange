import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true, index: true },
		fullname: { type: String, required: true },
		email: { type: String, required: true, unique: true, index: true },
		city: { type: String, required: true, default: "Unkown" },
		state: { type: String, required: true, default: "Unknown" }
	},
	{ timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
