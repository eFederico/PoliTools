class NotConvertedError extends Error {
    constructor(vc, message="The requested VC has not been converted yet.", ...args) {
        super(message, ...args);

        if(Error.captureStackTrace)
            Error.captureStackTrace(this, NotConvertedError);
        
        this.vc      = vc;
        this.message = message;
    }
}

class RequestError extends Error {
    constructor(xhr, status, error, message="Failure in performing the request.", ...args) {
        super(message, ...args);

        if(Error.captureStackTrace)
            Error.captureStackTrace(this, RequestError);
        
        this.xhr    = xhr;
        this.status = status;
        this.error  = error;
    }
}