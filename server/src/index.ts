import * as express from 'express';
const bodyParser = require('body-parser');
import { apiRouter } from './api';
import { errorHandler } from './middleware';
import logger from './util/logger';
import {StatusMessages, Error} from "./api/error";
import * as path from "path";
const steem = require('steem');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// app.use(appMiddleware(app));
app.use('/api', checkBody, isValidAccountObject, isValidAccount, apiRouter);

app.use(express.static(__dirname + '../../../../client/dist/'));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname+'../../../../client/dist/index.html'));
});
app.use(errorHandler);

// Given that all request at the moment are POST, they include body
function checkBody(req: any, res: any, next: any) {
    if (req.body === undefined) { return res.status(400).send(new Error(StatusMessages._400)); }
    if (Object.keys(req.body).length === 0) { return res.status(400).send(new Error(StatusMessages._400)); }
    next();
}

// -//- & every request should have an Account object on acc field {username: string, privateKey: string, publicKey: string}
function isValidAccountObject(req: any, res: any, next: any) {
    if (!req.body.acc || !req.body.acc.user || !req.body.acc.privateKey || !req.body.acc.publicKey) {
        return res.status(400).send(new Error(StatusMessages._400)); }
    next();
}

// Checks if the public with the private key are valid.
function isValidAccount(req: any, res: any, next: any) {
    steem.api.setOptions({ url: 'https://api.steemit.com' });
    try {
        if (steem.auth.wifIsValid(req.body.acc.privateKey, req.body.acc.publicKey)) {
            next();
        } else {
            return res.status(401).send(new Error(StatusMessages._401));
        }
    } catch (err) { return res.status(401).send(new Error(StatusMessages._401)); }
}

export default app;
