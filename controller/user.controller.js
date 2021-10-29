import express from 'express';

import * as UserService from '../service/user.service.js';

const userRouter = express.Router();

const storeUser = (req, res, next) => {
    UserService.storeUser(req.body)
        .then(() => {
            res
                .status(201)
                .send({
                    message: 'Successfully stored user data.',
                    hasErrors: false
                })
        })
        .catch(err => {
            console.log(err);
            res
                .status(500)
                .send({
                    message: 'Error while storing user data.',
                    hasErrors: true
                })
        });
};

// routes
userRouter.post('/create', storeUser);

export default userRouter;