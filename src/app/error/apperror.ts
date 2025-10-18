class AppError extends Error{
    public statuscode: number;

    constructor(statuscode: number, message: string,  stack = '') {
        super(message)
        this.statuscode = statuscode

        if(stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default AppError