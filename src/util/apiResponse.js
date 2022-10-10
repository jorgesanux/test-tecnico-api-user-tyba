class APIResponse {
    constructor({statusCode, message = null, results = [], result = null}){
        this.status = statusCode;
        this.message = message;
        this.results = results;
        this.result = result;
    }

    toJSON(){
        return {
            status: this.status,
            message: this.message,
            results: this.results,
            result: this.result
        };
    }
}

export default APIResponse;