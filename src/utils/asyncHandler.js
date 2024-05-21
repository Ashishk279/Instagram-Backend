const asyncHandler = (requedtHandler) => {
    return (req, res , next)=>{
       Promise.resolve(requedtHandler(req, res, next)).catch(err => next(err))
    }
}

export { asyncHandler }