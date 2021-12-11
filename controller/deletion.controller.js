import express from 'express';

import * as DeletionService from '../service/deletion.service';
import { logger } from "../util/logging.js";

const deletionRouter = express.Router();

const deleteUser = (req, res, next) => {
    DeletionService.deleteUser(req)
        .then((responseData) => {
            res
                .status(200)
                .send(responseData)
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while deleting user.',
                    hasErrors: true
                })
        });
};

const checkStatus = (req, res, next) => {
    DeletionService.checkStatus(req.query)
        .then((isDeleted) => {
            if (isDeleted) {
                res
                    .status(200)
                    .send({
                        status: 'User is deleted.'
                    });
            } else {
                res
                    .status(200)
                    .send({
                        status: 'User is not yet deleted.'
                    });
            }
        })
        .catch(err => {
            logger.log({
                level: 'error',
                message: err
            });
            res
                .status(500)
                .send({
                    message: 'Error while fetching user deletion status.',
                    hasErrors: true
                });
        });
};

deletionRouter.post('/', deleteUser);
deletionRouter.post('/status', checkStatus);
