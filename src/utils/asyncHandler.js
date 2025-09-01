//  PROMISES 1st way

// requestHandler is a name we used by ourselves, we didnt get any props from anywhere
// we could have used any other name as well instead of this, but we used this for better code readability
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((error) => next(error))
    }

}

export {asyncHandler}

// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}


//  TRY - CATCH WAY WRAPPER 2nd way
// higher order function used here
// const asyncHandler = (fn) => async(req, res, next) =>{
//     try{
//         await fn(req, res, next)
//     }catch(error){
//         res.status(error.code || 500).json({
//             success: false,  //can be seen by frontend to recognize that something went wrong
//             message: error.message
//         })

//     }
// }