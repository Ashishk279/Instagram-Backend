
const sendMessage = async (req, res, next) => {
    try {
        const { recipent, content } = req.body
        const userId = req.user;
        await validateMessage(req.body);
        const user = await message(req.user, req.body);
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("message_send")))
    } catch (error) {
        next(error)
    }
}

const getMessagesBetweenUsers = async(req, res, next)=> {
    try {
        const { recipentid} = req.params
        const userId = req.user;
        const user = await getMessage(req.params.recipentid, req.user);
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("message_send")))
    } catch (error) {
        next(error)
    }
}

const markMessageAsRead  = async (req, res, next) => {
    try {
        const { messageId } = req.params
        const userId = req.user;
        const user = await markRead(req.params.messageId);
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("message_send")))
    } catch (error) {
        next(error)
    }
}

const deleteMessage   = async (req, res, next) => {
    try {
        const { messageId } = req.params
        const userId = req.user;
        const user = await deleteMsg(req.params.messageId);
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("message_send")))
    } catch (error) {
        next(error)
    }
}