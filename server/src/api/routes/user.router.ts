import { Router } from 'express';
import logger from "../../util/logger";
import DBClient from "../../database/dbClient";
const ObjectId = require('mongodb').ObjectID;
import {StatusMessages, Error} from "../error";

let router = Router();

const alreadyQueued = (username: string) => {
    return {title: `${username} exists`, message: `You are already queued for auto-following bot. Key updated.`}
};

const inserted = (username: string) => {
    return {title: `${username} added`, message: `You have been added to queue for auto-following bot.`}
};

const deleted = (username: string) => {
    return {title: `${username} removed`, message: `This user have been removed from queue and database`}
};

router.post('/', async (req: any, res) => {
    const acc = req.body.acc;
    try {
        const exists = await DBClient.findOne({username: acc.user}, 'users');
        if (exists) {
            await DBClient.update({_id: exists['_id']}, {username: acc.user, privateKey: acc.privateKey}, 'users');
            res.status(200).send(alreadyQueued(acc.user));
        } else {
            await DBClient.insertOne({username: acc.user, privateKey: acc.privateKey}, 'users');
            res.status(200).send(inserted(acc.user));
        }
    } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

router.post('/delete', async (req: any, res) => {
    const acc = req.body.acc;
    try {
        const exists = await DBClient.findOne({username: acc.user}, 'users');
        if (exists) {
            await DBClient.deleteOne({username: acc.user}, 'users');
            res.status(200).send(deleted(acc.user));
        } else {
            res.status(404).send(new Error(StatusMessages._404));
        }
    } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

export let userRouter = router;
