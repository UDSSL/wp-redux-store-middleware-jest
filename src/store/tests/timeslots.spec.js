import { apiCallBegan } from '../api'
import { addTimeslot, timeslotAdded, timeslotAddRequested } from '../timeslots'
describe('timeslotsSlice', () => {
    describe('action creators', () => {
        it('should addTimeslot', () => {
            const timeslot = { description: 'a' }
            const result = addTimeslot(timeslot)
            const expected = {
                type: apiCallBegan.type,
                payload: {
                    url: '/timeslots',
                    method: 'post',
                    data: timeslot,
                    onStart: timeslotAddRequested.type,
                    onSuccess: timeslotAdded.type,
                },
            }
            expect(result).toEqual(expected)
        })
    })
})
