export interface MyError {
    title: string;
    message: string;
}

export class Error {
    public title: string;
    public message: string;
    constructor(err: MyError = {title: 'Error Occurred', message: 'Please try again later or contact us.'}) {
        this.title = err.title;
        this.message = err.message;
    }
}

export abstract class StatusMessages {
    public static _400 = {title: 'Bad Request', message: 'Unacceptable request.'};
    public static _401 = {title: 'Unauthorized', message: 'Invalid Credentials.'};
    public static _403 = {title: 'Forbidden', message: 'Missing required permissions.'};
    public static _404 = {title: 'Not Found', message: 'Resource not found.'};
    public static _498 = {title: 'Invalid token', message: 'Missing or expired token'};
    public static _500 = {title: 'Internal Server Error', message: 'Error occurred.'};
}

