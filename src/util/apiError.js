class APIError extends Error{
    constructor(status, message, code){
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.code = code;
    }

    toJSON(){
        return {
            status: this.status,
            code: this.code,
            message: this.message,
            result: null,
            results: []
        };
    }
}

export default APIError;