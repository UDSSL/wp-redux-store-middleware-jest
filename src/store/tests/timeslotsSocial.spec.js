import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {
    addTimeslot,
    assignTimeslotToUser,
    getUnassignedTimeslots,
    loadTimeslots,
    assignTimeslot,
} from '../timeslots'
import configureStore from '../configureStore'

describe('timeslotsSliceSocial', () => {
    let fakeAxios
    let store

    beforeEach(() => {
        fakeAxios = new MockAdapter(axios)
        store = configureStore()
    })

    const timeslotsSlice = () => store.getState().entities.timeslots

    const createState = () => ({
        entities: {
            timeslots: {
                list: [],
            },
        },
    })

    describe('assign timeslot to a user', () => {
        it('should assign a timeslot to a user', async () => {
            fakeAxios
                .onPost('/timeslots')
                .reply(200, { id: 3, description: 'br' })
            fakeAxios.onPatch('/timeslots/3').reply(200, { id: 3, userId: 6 })

            await store.dispatch(addTimeslot({ description: 'b' }))
            const x = await store.dispatch(assignTimeslotToUser(3, 6))

            expect(timeslotsSlice().list[0].user).toBe(6)
        })
    })

    describe('loading timeslots', () => {
        describe('if the timeslots exist in the cache', () => {
            it('should not be fetched from the server again', async () => {
                fakeAxios.onGet('/timeslots').reply(200, [{ id: 1 }])

                await store.dispatch(loadTimeslots())
                await store.dispatch(loadTimeslots())

                expect(fakeAxios.history.get.length).toBe(1)
            })
        })

        describe('if the timeslots do not exist in the cache', () => {
            it('should be fetched from the server', async () => {
                fakeAxios.onGet('/timeslots').reply(200, [{ id: 1 }])

                await store.dispatch(loadTimeslots())

                expect(timeslotsSlice().list).toHaveLength(1)
            })
        })
        describe('loading indicator', () => {
            it('shold be true while fetching the timeslots', () => {
                fakeAxios.onGet('/timeslots').reply(() => {
                    expect(timeslotsSlice().loading).toBe(true)
                    return [200, [{ id: 1 }]]
                })

                store.dispatch(loadTimeslots())
            })

            it('shold be false after fetching the timeslots', async () => {
                fakeAxios.onGet('/timeslots').reply(200, [{ id: 1 }])
                await store.dispatch(loadTimeslots())
                expect(timeslotsSlice().loading).toBe(false)
            })

            it('shold be false after if server error', async () => {
                fakeAxios.onGet('/timeslots').reply(500)
                await store.dispatch(loadTimeslots())
                expect(timeslotsSlice().loading).toBe(false)
            })
        })
    })

    it('should add the timeslot to the store if it saved in the database', async () => {
        // Arrange
        const timeslot = { description: 'a' }
        const savedTimeslot = { ...timeslot, id: 1 }
        fakeAxios.onPost('/timeslots').reply(200, savedTimeslot)

        // Act
        await store.dispatch(addTimeslot(timeslot))

        // Assert
        expect(timeslotsSlice().list).toContainEqual(savedTimeslot)
    })

    it("should not add the timeslot to the store if it's not saved in the database", async () => {
        // Arrange
        const timeslot = { description: 'a' }
        fakeAxios.onPost('/timeslots').reply(500)

        // Act
        await store.dispatch(addTimeslot(timeslot))

        // Assert
        expect(timeslotsSlice().list).toHaveLength(0)
    })

    it('should update/assign the timeslot to the store if it update/assign in the database', async () => {
        // Arrange
        fakeAxios.onPost('/timeslots').reply(200, { id: 1 })
        fakeAxios.onPatch('/timeslots/1').reply(200, { id: 1, assigned: true })

        // Act
        await store.dispatch(addTimeslot({}))
        await store.dispatch(assignTimeslot(1))

        // Assert
        expect(timeslotsSlice().list[0].assigned).toBe(true)
    })

    it('should not update/assign the timeslot to the store if it did not update/assign in the database', async () => {
        // Arrange
        fakeAxios.onPost('/timeslots').reply(200, { id: 1 })
        fakeAxios.onPatch('/timeslots/1').reply(500)

        // Act
        await store.dispatch(addTimeslot({}))
        await store.dispatch(assignTimeslot(1))

        // Assert
        expect(timeslotsSlice().list[0].assigned).not.toBe(true)
    })

    it('should return the unassigned timeslot count', () => {
        const state = createState()
        state.entities.timeslots.list = [
            { id: 1, assigned: true },
            { id: 2 },
            { id: 3 },
        ]

        const result = getUnassignedTimeslots(state)

        expect(result).toHaveLength(2)
    })
})
