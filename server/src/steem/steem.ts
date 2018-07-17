import logger from "../util/logger";

const steem = require('steem');
import DBClient from '../../src/database/dbClient';

interface Log {
    type: string;
    owner: string;
    message: string;
}

interface User {
    _id: any;
    username: string;
    privateKey: string;
}

export default class SteemController {
    private dateStarted =  new Date().toLocaleString();
    logs: Log[] = [];
    errors = 0;

    constructor() { steem.api.setOptions({ url: 'https://api.steemit.com' }); }

    public async startProcess() {
        logger.log('STARTING');
        await DBClient.connect();
        const usersDB = await DBClient.find({}, 'users');
        usersDB.length > 0 ? await this.start(usersDB) : await this.endProcess();
    }

    private async endProcess() {
        this.logs.push({type: 'log', owner: '$server',
            message: `Process Ended At ${ new Date().toLocaleString()} With ${this.errors} Errors`});
        await DBClient.save({date: this.dateStarted, logs: this.logs}, 'logs');
    }

    private addLog(log: Log) {
        logger.log(log);
        if (log.type === 'error') { this.errors++; }
        this.logs.push(log);
    }

    private async checkIfValidKey(user: User) {
        return new Promise<boolean>(((resolve, reject) => {
            steem.api.getAccounts([user.username], (err: any, result: any) => {
                if (err) { reject(false); return; }
                try {
                    const publicKey = result[0].posting.key_auths[0][0];
                    steem.auth.wifIsValid(user.privateKey, publicKey);
                    resolve(true);
                } catch (error) { reject(false); }
            });
        }));
    }

    private async start(users: User[]) {
        let index = 0;
        for (let user of users) {
            index++;
            const valid = await this.checkIfValidKey(user);
            valid ? await this.startFor(user) :
                this.addLog({
                    type: 'error',
                    owner: user.username,
                    message: 'KEYS NOT VALID' });
            if (index == users.length-1) {
                await this.endProcess();
            }
        }
    }

    private async startFor(user: User) {
        try {
            const count: {[key: string]: any} = await this.getCount(user.username);
            const followers = await this.getFollowers(user.username, count['follower_count']);
            const following = await this.getFollowing(user.username, count['following_count']);
            let temp = await this.getUsersToBeFollowed(followers, following, user);
            if (temp.length == 0) {
                this.addLog({type: 'log', owner: user.username, message: `FOLLOWS EVERY FOLLOWER ALREADY`});
                return;
            }
            this.addLog({type: 'log', owner: user.username, message: `HAS TO FOLLOW --> ${temp.length}  users`});
            this.follow(user, temp, 0);
        } catch(error) { this.addLog({type: 'error', owner: user.username, message: error}); }
    }

    private getCount(username: string) {
        return new Promise((resolve, reject) => {
            steem.api.getFollowCount(username, (err: any, result: any) => err ? reject(err): resolve(result));
        });
    }

    private getFollowers(username: string, count: number) {
        return new Promise((resolve, reject) => {
            steem.api.getFollowers(username, 0, 'blog', count,
                (err: any, result: any) => err ? reject(err): resolve(result));
        })
    }

    private getFollowing(username: string, count: number) {
        return new Promise((resolve, reject) => {
            steem.api.getFollowing(username, 0, 'blog', count,
                (err: any, result: any) => err ? reject(err): resolve(result));
        })
    }

    private follow(user: User, willFollow: any[], idx = 0){
        if (idx < willFollow.length) {
            setTimeout( async () => {
                try {
                    await steem.broadcast.customJson(user.privateKey, [], [user.username], 'follow', willFollow[idx]);
                    if ( idx == willFollow.length-1) {
                        this.addLog({type: 'log', owner: user.username, message: `FOLLOWED ${willFollow.length} users`});
                    }
                    this.follow(user, willFollow, idx+1);
                } catch (error) { this.addLog({type: 'error', owner: user.username, message: error}); }
            }, 8000);
        }
    }

    private async getUsersToBeFollowed(followers: any, following: any, user: User) {
        const toFollow = [];
        for (let follower of followers) {
            const val = follower['follower'];
            let exists = false;
            for (let idx in following) {
                if (val === following[idx]['following']) {
                    following.splice(parseInt(idx, 10), 1);
                    exists = true;
                    break;
                }
            }
            if (!exists) { toFollow.push(follower); }
        }
        return this.getFollowUsersRequests(user.username, toFollow);
    }

    private getFollowUsersRequests(username: string, toFollow: any[]) {
        return toFollow.map( (willFollow) => SteemController.createJSONRequest(username, willFollow['follower']))
    }

    static createJSONRequest(username: string, toFollow: string) {
        return JSON.stringify([
            'follow', {
                follower: username,
                following: toFollow,
                what: ['blog']
            }
        ]);
    }
}
