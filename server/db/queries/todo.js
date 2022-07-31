import Todo from '../models/todo.js';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

export async function getUserTodos(userId, filter = {}) {
    const todos = await Todo.find({ userId: new ObjectId(userId), ...filter });
    return todos;
}

export async function createTodo(userId, content) {
    const todo = new Todo({
        userId,
        content,
    });
    const { errors } = await todo.save().catch(err => err);
    return errors ? false : true;
}

export async function updateTodo(id, changes) {
    return await Todo.findByIdAndUpdate(id, changes);
}

export async function deleteTodos(filter) {
    return await Todo.deleteMany(filter).exec();
}
