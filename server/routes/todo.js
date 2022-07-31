import express from 'express';
import { verifyToken } from '../middleware/authentication.js';
import {
    getUserTodos,
    createTodo,
    deleteTodos,
    updateTodo,
} from '../db/queries/todo.js';

const router = express.Router();
export default router;

router.get('/', verifyToken, async (req, res) => {
    const filters = req.body;
    const todos = await getUserTodos(req.userId, filters);
    res.status(200).json(todos);
});

router.post('/', verifyToken, async (req, res) => {
    const content = req.body.content;
    const userId = req.userId;

    if (!content) return res.sendStatus(401);

    const response = await createTodo(userId, content);
    return response ? res.sendStatus(201) : res.sendStatus(401);
});

router.delete('/', verifyToken, async (req, res) => {
    const filter = req.body;
    await deleteTodos(filter);
    res.sendStatus(204);
});

router.patch('/', verifyToken, async (req, res) => {
    const { _id: id, ...changes } = req.body;

    await updateTodo(id, changes);
    res.sendStatus(204);
});
