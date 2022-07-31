import express from 'express';
import dotenv from 'dotenv';
import { connect } from './db/mongo.js';
import login from './routes/auth.js';
import todo from './routes/todo.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }
    next();
});

app.use('/user', login);
app.use('/todo', todo);

connect();
app.listen(5000);
