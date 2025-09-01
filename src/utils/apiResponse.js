class apiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400
        // we have used a statusCode < 400 bec >400 statusCodes are basically for errors
        // and we are currently writing code for response
    }
}

export {apiResponse} 