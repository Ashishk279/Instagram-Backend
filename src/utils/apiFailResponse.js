import { BAD_REQUEST} from './responseCode.js'

function sendFailResponse(req, res, httpCode = BAD_REQUEST, message, data) {
    if (!data && message) {
        data = {
            statusCode : httpCode,
            message:  message
        };
    }else if(data && message){
        data.message =  message;
    }
    if(data){
        data.data = {};
    }
   return res.status(httpCode).json(data);
}

export {sendFailResponse}