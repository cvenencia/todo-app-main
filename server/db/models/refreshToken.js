import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const RefreshTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User required.'],
    },
});

export default model('RefreshToken', RefreshTokenSchema);
