const error = store => next => action => {
    // if (action.type === 'api/callFailed') console.log('Tostify: ', action.payload.message)
    // else return next(action)

    return next(action)
}

export default error
