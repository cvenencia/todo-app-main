import { Schema, model } from 'mongoose';

const todoSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User required.'],
    },
    active: {
        type: Boolean,
        default: true,
    },
    content: {
        type: String,
        validate: {
            validator: content => content.length > 0,
            message: 'Invalid content',
        },
    },
});

export default model('Todo', todoSchema);
