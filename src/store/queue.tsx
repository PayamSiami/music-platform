import { Track } from '@/helpers/types'
import { create } from 'zustand'

type QueueStore = {
	activeQueueId: string | null
	queue: Track[]
	setActiveQueueId: (id: string | null) => void
	setQueue: (tracks: Track[]) => void
	appendToQueue: (track: Track) => void
	removeFromQueue: (trackUrl: string) => void
}

export const useQueueStore = create<QueueStore>()((set) => ({
	activeQueueId: null,
	queue: [],
	setActiveQueueId: (id) => set({ activeQueueId: id }),
	setQueue: (tracks) => set({ queue: tracks }),
	appendToQueue: (track) =>
		set((state) => ({ queue: [...state.queue, track] })),
	removeFromQueue: (trackUrl) =>
		set((state) => ({
			queue: state.queue.filter((track) => track.url !== trackUrl),
		})),
}))

export const useQueue = () => useQueueStore((state) => state)