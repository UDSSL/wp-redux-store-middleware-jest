import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import {
    getUnassignedTimeslots,
    loadTimeslots,
    assignTimeslot,
} from '../store/timeslots'

const TimeslotsList = () => {
    const dispatch = useDispatch()

    const timeslots = useSelector(getUnassignedTimeslots)

    useEffect(() => {
        dispatch(loadTimeslots())
    }, [])

    return (
        <ul>
            {timeslots.map(timeslot => (
                <React.Fragment>
                    <li key={timeslot.id}>
                        {timeslot.description} -{' '}
                        <button
                            onClick={() =>
                                dispatch(assignTimeslot(timeslot.id))
                            }
                        >
                            Assign
                        </button>
                    </li>
                </React.Fragment>
            ))}
        </ul>
    )
}

export default TimeslotsList
