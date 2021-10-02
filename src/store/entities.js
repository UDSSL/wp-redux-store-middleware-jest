import { combineReducers } from 'redux'
import timeslotsReducer from './timeslots'
import projectsReducer from './projects'
import usersReducer from './users'

export default combineReducers({
    timeslots: timeslotsReducer,
    projects: projectsReducer,
    users: usersReducer,
})
