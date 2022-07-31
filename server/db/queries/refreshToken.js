import RefreshToken from '../models/refreshToken.js';

export async function getRefreshToken(refreshToken) {
    const rt = await RefreshToken.findOne({ token: refreshToken }).exec();
    return rt;
}

export async function deleteRefreshToken(refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken }).exec();
}

export async function deleteUsersRefreshToken(userId) {
    await RefreshToken.deleteMany({ userId }).exec();
}
