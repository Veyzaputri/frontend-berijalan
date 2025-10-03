import { ICounter } from '@/interfaces/service/counter.interface'
import { IQueue } from '@/interfaces/service/queue.interface'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type InitialState = {
    selectedCounter: ICounter | null
    currentQueue: IQueue| null
    claimedQueue: {
        queueNumber: number
        estimatedWaitTime: number
        position: number
        counterName: string
        counterId: number
    } | null
}

type ICounterAppStore = InitialState & {
    setSelectedCounter: (counter: InitialState['selectedCounter']) => void
    setCurrentQueue: (queue: InitialState['currentQueue']) => void
    setClaimedQueue: (queue: InitialState['claimedQueue']) => void
    reset: () => void
}   

const initialState: InitialState = {
    selectedCounter: null,
    currentQueue: null,
    claimedQueue:null,

}

export const useCounterAppStore = create(
    persist<ICounterAppStore>(
        set => ({
            ...initialState,
            setSelectedCounter: selectedCounter => set ({ selectedCounter}),
            setCurrentQueue: currentQueue => set({ currentQueue}),
            setClaimedQueue: claimedQueue => set({ claimedQueue}),
            reset: () => set(initialState),
        }),
        {name: 'counter-app-store'}
    )
)