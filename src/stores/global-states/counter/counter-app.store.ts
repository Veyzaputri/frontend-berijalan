import { ICounter } from '@/interfaces/service/counter.interface';
import { IQueue } from '@/interfaces/service/queue.interface';
import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

type InitialState = {
  counters: ICounter[];
  selectedCounter: ICounter | null;
  currentQueue: IQueue | null;
  claimedQueue: {
    queueNumber: number;
    estimatedWaitTime: number;
    position: number;
    counterName: string;
    counterId: number;
  } | null;
};

type ICounterAppStore = InitialState & {
  setCounters: (counters: ICounter[]) => void;
  setSelectedCounter: (counter: InitialState['selectedCounter']) => void;
  setCurrentQueue: (queue: InitialState['currentQueue']) => void;
  setClaimedQueue: (queue: InitialState['claimedQueue']) => void;
  reset: () => void;
};

// Generic helper untuk persist + TypeScript
type MyPersist = <T>(
  config: StateCreator<T>,
  options: PersistOptions<T>
) => StateCreator<T>;

const initialState: InitialState = {
  counters: [],
  selectedCounter: null,
  currentQueue: null,
  claimedQueue: null,
};

export const useCounterAppStore = create<ICounterAppStore>(
  (persist as MyPersist)(
    (set) => ({
      ...initialState,
      setCounters: (counters) => set({ counters }),
      setSelectedCounter: (selectedCounter) => set({ selectedCounter }),
      setCurrentQueue: (currentQueue) => set({ currentQueue }),
      setClaimedQueue: (claimedQueue) => set({ claimedQueue }),
      reset: () => set(initialState),
    }),
    { name: 'counter-app-store' }
  )
);
