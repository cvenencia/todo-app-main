import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import RefreshToken from '../models/refreshToken.js';
import { deleteUsersRefreshToken } from './refreshToken.js';

export async function registerUser(data) {
    const pepper = process.env.PEPPER;
    const TOKEN_SECRET = process.env.TOKEN_SECRET;
    const { username, password } = data;
    if (await userExists(username))
        return { response: -1, message: 'User already exists' };
    if (!password || !username)
        return { response: 0, message: 'Invalid data for registration.' };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password + pepper, salt);
    const user = new User({
        username,
        hashedPassword,
        salt,
    });
    const { errors } = await user.save().catch(err => err);

    if (errors)
        return { response: 0, message: 'Invalid data for registration.' };
    const token = jwt.sign(
        {
            userId: user._id,
        },
        TOKEN_SECRET,
        {
            expiresIn: process.env.TOKEN_EXPIRATION_TIME,
        }
    );
    const refreshToken = jwt.sign(
        {
            userId: user._id,
        },
        process.env.REFRESH_TOKEN_SECRET
    );
    await user.save().catch(err => err);
    await new RefreshToken({ userId: user._id, token: refreshToken })
        .save()
        .catch(err => err);
    return { response: 1, token: token, refreshToken };
}

export async function loginWithCredentials(data) {
    const { username, password } = data;
    const user = await validateCredentials(username, password);
    if (!user) return null;
    const token = jwt.sign(
        {
            userId: user._id,
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: process.env.TOKEN_EXPIRATION_TIME,
        }
    );
    const refreshToken = jwt.sign(
        {
            userId: user._id,
        },
        process.env.REFRESH_TOKEN_SECRET
    );
    deleteUsersRefreshToken(user._id);
    await new RefreshToken({ userId: user._id, token: refreshToken })
        .save()
        .catch(err => err);
    await user.save().catch(err => err);
    return { token, refreshToken };
}

async function validateCredentials(username, password) {
    const pepper = process.env.PEPPER;
    const user = await User.findOne({ username }).exec();
    if (!user) return false;

    const { salt } = user;
    const hashedPassword = await bcrypt.hash(password + pepper, salt);
    return user.hashedPassword === hashedPassword ? user : false;
}

async function userExists(username) {
    const user = await User.findOne({ username }).exec();
    return user == null ? false : true;
}
