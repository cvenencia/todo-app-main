import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username required.'],
    },
    hashedPassword: {
        type: String,
        required: [true, 'Password required.'],
    },
    salt: {
        type: String,
        required: [true, 'Salt required'],
    },
});

export default model('User', userSchema);
