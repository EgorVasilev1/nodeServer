const { register, login, refresh, updatePassword, updateUsername, logout, checkPassword, hashPassword } = require('./authService');
const RedisClient = require('../config/redis');
const { getUsername } = require('./authModel');

// Регистрация пользователя с кэшированием jwt токена в Redis 
const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const registerUser = await register(username, password);
        await RedisClient.set(registerUser.accessToken, JSON.stringify(username, password), { EX: 3600 });
        await RedisClient.set(registerUser.refreshToken, JSON.stringify(username, password), { EX: 604800 });
        res.status(200).json(registerUser);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Ошибка при регистрации", error: error.message });
    }
};

// Вход пользователя
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const logUser = await login(username, password);
        res.status(200).json({ message: "Вход выполнен", logUser });
    } catch (error) {
        res.status(500).json({ message: "Ошибка при входе", error: error.message });
    }
};

// Обновление токена
const refreshTokens = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token отсутствует" });
        }
        const { accessToken, newRefreshToken } = await refresh(refreshToken);
        res.status(200).json({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error("Ошибка при обновлении токена:", error);

        res.status(500).json({ message: "Ошибка при обновлении токена", error: error.message });
    }
};

// Удаление пользователя
const logoutUser = async (req, res) => {
    try {
        const { username, accessToken, refreshToken } = req.body;
        if (getUsername(username) === null) {
            return res.status(404).json({ message: `User ${username} not found` });
        }
        logout(username, accessToken, refreshToken);
        res.status(200).json({ message: `${username} deleted` });
    } catch (error) {
        res.status(500).json({ message: "Ошибка при выходе", error: error.message });
    }
};

// Обновление имени пользователя
const updateUsernameUser = async (req, res) => {
    try {
        const { username, newUsername } = req.body;
        if (await getUsername(username) === null) {
            return res.status(404).json({ message: `User ${username} not found` });
        }
        updateUsername(username, newUsername);
        res.status(200).json({ message: `Update username ${username} renamed to ${newUsername}` });
    } catch (error) {
        res.status(500).json({ message: "Ошибка при обновлении имени пользователя", error: error.message });
    }
};


// Обновление пароля пользователя
const updatePasswordUser = async (req, res) => {
    try {
        const { username, password, newPassword } = req.body;
        const user = await getUsername(username);
        console.log(username, password, newPassword);
        console.log(user);
        if (user === null) {
            return res.status(404).json({ message: `User ${username} not found` });
        }
        if (!await checkPassword(password, user.password)) {
            console.log(password, user.password);
            return res.status(400).json({ message: "Wrong password" });
        }
        await updatePassword(username, await hashPassword(newPassword));
        res.status(200).json({ message: `Update password for ${username}` });
    } catch (error) {
        res.status(500).json({ message: "Ошибка при обновлении пароля", error: error.message });
    }
};

module.exports = { registerUser, loginUser, logoutUser, updatePasswordUser, updateUsernameUser, refreshTokens };