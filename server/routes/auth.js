import express from 'express';
import { registerUser, loginWithCredentials } from '../db/queries/user.js';
import jwt from 'jsonwebtoken';
import {
    deleteRefreshToken,
    getRefreshToken,
} from '../db/queries/refreshToken.js';

const router = express.Router();
export default router;

router.post('/register', async (req, res) => {
    const data = req.body;
    const { response, ...rest } = await registerUser(data);
    switch (response) {
        case -1:
            return res.status(403).json({ error: rest.message });
        case 0:
            return res.status(401).json({ error: rest.message });
        case 1:
            return res
                .status(200)
                .json({ token: rest.token, refreshToken: rest.refreshToken });
    }
});

router.post('/login', async (req, res, next) => {
    const data = req.body;
    const response = await loginWithCredentials(data);
    if (!response)
        return res.status(403).json({ error: 'Invalid credentials.' });
    const { token, refreshToken } = response;
    res.status(200).json({ token, refreshToken });
    next();
});

router.delete('/logout', async (req, res) => {
    const refreshToken = req.body.token;
    deleteRefreshToken(refreshToken);
    res.sendStatus(204);
});

router.post('/token', async (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);

    const rt = await getRefreshToken(refreshToken);
    if (!rt) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const token = jwt.sign(
            { userId: user.userId },
            process.env.TOKEN_SECRET,
            {
                expiresIn: process.env.TOKEN_EXPIRATION_TIME,
            }
        );
        res.json({ token: token });
    });
});
