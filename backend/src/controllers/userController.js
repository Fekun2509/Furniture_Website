import userServices from "../services/userServices"
import productServices from "../services/productServices"

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input parameters!'
        })
    }


    let userData = await userServices.handleUserLogin(email, password);

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; //ALL, id

    if (!id) {
        return res.status(200).json({
            errCode: 0,
            errMessage: 'Missing required parameter',
            users: []
        })
    }

    let users = await userServices.getAllUsers(id);


    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    let message = await userServices.createNewUser(req.body)
    return res.status(200).json(message)
}

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userServices.updateUserData(data);
    return res.status(200).json(message)
}

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parametter"
        })
    }
    let message = await userServices.deleteUser(req.body.id)
    return res.status(200).json(message)
}



let handleGoogleLogin = async (req, res) => {
    const { accessToken } = req.body;
    if (!accessToken) {
        return res.status(400).json({ errCode: 1, message: 'Missing accessToken' });
    }
    try {
        let result = await userServices.handleGoogleLogin(accessToken);
        return res.status(200).json({
            errCode: result.errCode,
            message: result.errMessage,
            user: result.user || {},
        });
    } catch (e) {
        return res.status(500).json({ errCode: -1, message: 'Server error' });
    }
};

let handleFacebookLogin = async (req, res) => {
    const { accessToken, userId } = req.body;
    if (!accessToken || !userId) {
        return res.status(400).json({ errCode: 1, message: 'Missing accessToken or userId' });
    }
    try {
        let result = await userServices.handleFacebookLogin(accessToken, userId);
        return res.status(200).json({
            errCode: result.errCode,
            message: result.errMessage,
            user: result.user || {},
        });
    } catch (e) {
        return res.status(500).json({ errCode: -1, message: 'Server error' });
    }
};

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    handleGoogleLogin: handleGoogleLogin,
    handleFacebookLogin: handleFacebookLogin,
}
