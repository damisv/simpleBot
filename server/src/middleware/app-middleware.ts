import { Request, Response, NextFunction, Express } from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import { default as config, ENV } from '../config';
import logger from "../util/logger";
const express = require('express');

export function appMiddleware(app: Express) {
    app.use(express.static(__dirname + '../../../../client/dist/'));

    app.get('/*', function(req, res) {
        res.sendFile(path.join(__dirname+'../../../../client/dist/index.html'));
    });
    // return (req: Request, res: Response, next: NextFunction) => {
    //     // Serve static server only in production mode. In any other modes, treat this as a standalone API server.
    //     logger.log(config.environment);
    //     if (config.environment === ENV.prod) {
    //
    //         res.sendFile(path.join(__dirname+'../../../../client/dist/index.html'));
    //         // app.use(express.static(path.join(__dirname, '../../../../client/dist/index.html')));
    //     }
    //     app.use(bodyParser.urlencoded({ extended: true }));
    //     app.use(bodyParser.json());
    //     next();
    // }
}