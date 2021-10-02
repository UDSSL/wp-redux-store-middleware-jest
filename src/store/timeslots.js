import { createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import { apiCallBegan } from './api'
import moment from 'moment'

let lastId = 0

const slice = createSlice({
    name: 'timeslots',
    initialState: {
        list: [],
        loading: false,
        lastFetch: null,
    },
    reducers: {
        timeslotsRequested: (timeslots, action) => {
            timeslots.loading = true
        },
        timeslotAddRequested: (timeslots, action) => {
            timeslots.loading = true
        },
        timeslotAssignRequested: (timeslots, action) => {
            timeslots.loading = true
        },
        timeslotsRequestFailed: (timeslots, action) => {
            timeslots.loading = false
        },
        timeslotsReceived: (timeslots, action) => {
            timeslots.loading = false
            timeslots.list.push(...action.payload)
            timeslots.lastFetch = Date.now()
        },
        timeslotAdded: (timeslots, action) => {
            timeslots.list.push(action.payload)
            timeslots.loading = false
        },
        timeslotAssigned: (timeslots, action) => {
            const index = timeslots.list.findIndex(
                timeslot => timeslot.id === action.payload.id
            )
            console.log(timeslots)
            timeslots.list[index].assigned = true
            timeslots.loading = false
        },
        timeslotAssignedToUser: (timeslots, action) => {
            const index = timeslots.list.findIndex(
                timeslot => timeslot.id === action.payload.id
            )
            const userId = action.payload.userId
            timeslots.list[index].user = userId
            timeslots.loading = false
        },
    },
})

export default slice.reducer

export const {
    timeslotAdded,
    timeslotAssigned,
    timeslotAddRequested,
    timeslotAssignedToUser,
    timeslotsReceived,
    timeslotsRequested,
    timeslotAssignRequested,
    timeslotsRequestFailed,
} = slice.actions

const url = '/timeslots'

export const loadTimeslots = () => (dispatch, getState) => {
    const { lastFetch } = getState().entities.timeslots

    const diffInMinutes = moment().diff(moment(lastFetch), 'minute')
    if (diffInMinutes < 10) return

    return dispatch(
        apiCallBegan({
            url,
            onFailure: timeslotsRequestFailed.type,
            onStart: timeslotsRequested.type,
            onSuccess: timeslotsReceived.type,
        })
    )
}

export const addTimeslot = timeslot =>
    apiCallBegan({
        url,
        method: 'post',
        data: timeslot,
        onStart: timeslotAddRequested.type,
        onSuccess: timeslotAdded.type,
    })

export const assignTimeslot = id =>
    apiCallBegan({
        url: `${url}/${id}`,
        method: 'patch',
        data: { assigned: true },
        onStart: timeslotAssignRequested.type,
        onSuccess: timeslotAssigned.type,
    })

export const assignTimeslotToUser = (timeslotId, userId) =>
    apiCallBegan({
        url: `${url}/${timeslotId}`,
        method: 'patch',
        data: { userId },
        onStart: timeslotAssignRequested.type,
        onSuccess: timeslotAssignedToUser.type,
    })

export const getUnassignedTimeslots = createSelector(
    state => state.entities.timeslots,
    timeslots => timeslots.list.filter(timeslot => !timeslot.assigned)
)
