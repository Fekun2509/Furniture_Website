import { raw } from "body-parser";
import db from "../models/index"
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);


let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (e) {
            reject(e)
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email)
            if (isExist) {

                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['id', 'email', 'role', 'password', 'fullname'],
                    raw: true
                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'ok';
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User is not found`
                }

            } else {
                userData.errCode = 1;
                userData.errMessage = `Your email isn't exist!`
            }

            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}



let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })

            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}


let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {

        try {
            let users = '';
            if (userId == 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }

            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)

        } catch (e) {
            reject(e)
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    message: 'Your email is already in use'
                })
            } else {
                let hashPasswordfromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordfromBcrypt,
                    fullname: data.fullname,
                    address: data.address,
                    phone: data.phone,
                    gender: data.gender,
                    role: data.role
                })

            }



            resolve({
                errCode: 0,
                message: 'Ok'
            })
        } catch (e) {
            reject(e)
        }
    })
}


let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId }
        })
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: 'User is not exist'
            })
        }

        await db.User.destroy({
            where: { id: userId }
        })

        resolve({
            errCode: 0,
            message: 'User is deleted!'
        })
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameter'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                // await db.User.save({
                //     fullname: data.fullname,
                //     address: data.address,
                //     phone: data.phone,
                //     gender: data.gender,
                //     role: data.role
                // })
                user.fullname = data.fullname;
                user.address = data.address;
                user.phone = data.phone;
                user.gender = data.gender;
                user.role = data.role;

                await user.save();

                resolve({
                    errCode: 0,
                    message: 'Update user success!'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'User is not found'
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}


let findOrCreateSocialUser = async (email, fullname) => {
    let user = await db.User.findOne({
        where: { email },
        attributes: ['id', 'email', 'role', 'fullname'],
        raw: true,
    });
    if (!user) {
        const hashedPassword = await hashUserPassword(`social_${Date.now()}`);
        await db.User.create({
            email,
            password: hashedPassword,
            fullname,
            role: 'customer',
        });
        user = await db.User.findOne({
            where: { email },
            attributes: ['id', 'email', 'role', 'fullname'],
            raw: true,
        });
    }
    return user;
};

let fetchJson = (url) => {
    const https = require('https');
    return new Promise((resolve, reject) => {
        https.get(url, (resp) => {
            let raw = '';
            resp.on('data', chunk => raw += chunk);
            resp.on('end', () => {
                try { resolve(JSON.parse(raw)); }
                catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
};

let handleGoogleLogin = (accessToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userInfo = await fetchJson(
                `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
            );

            console.log('[Google userInfo]', userInfo);

            if (userInfo.error || !userInfo.email) {
                return resolve({ errCode: 1, errMessage: 'Token Google không hợp lệ' });
            }

            const user = await findOrCreateSocialUser(userInfo.email, userInfo.name || userInfo.email);
            resolve({ errCode: 0, errMessage: 'ok', user });
        } catch (e) {
            console.error('[handleGoogleLogin error]', e);
            reject(e);
        }
    });
};

let handleFacebookLogin = (accessToken, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const https = require('https');

            // Verify token với Facebook
            const appToken = `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`;
            const debugData = await new Promise((res, rej) => {
                https.get(
                    `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${appToken}`,
                    (resp) => {
                        let data = '';
                        resp.on('data', chunk => data += chunk);
                        resp.on('end', () => res(JSON.parse(data)));
                    }
                ).on('error', rej);
            });

            if (!debugData.data?.is_valid || debugData.data?.user_id !== userId) {
                return resolve({ errCode: 1, errMessage: 'Token Facebook không hợp lệ' });
            }

            // Lấy thông tin user
            const fbUser = await new Promise((res, rej) => {
                https.get(
                    `https://graph.facebook.com/${userId}?fields=id,name,email&access_token=${accessToken}`,
                    (resp) => {
                        let data = '';
                        resp.on('data', chunk => data += chunk);
                        resp.on('end', () => res(JSON.parse(data)));
                    }
                ).on('error', rej);
            });

            const email = fbUser.email || `fb_${userId}@noemail.local`;
            const user = await findOrCreateSocialUser(email, fbUser.name || 'Facebook User');
            resolve({ errCode: 0, errMessage: 'ok', user });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    handleGoogleLogin: handleGoogleLogin,
    handleFacebookLogin: handleFacebookLogin,
}