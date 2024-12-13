

export function createStore<T>(initialState: T) {
	type Listener = (state: T, prevState: T) => void;

	const listeners: Set<Listener> = new Set();
	let state = initialState;

	function subscribe(listener: (state: T, prevState: T) => void) {
		listeners.add(listener);

		return () => listeners.delete(listener);
	}

	function getState(): T {
		return state;
	}

	function setState(nextState: T) {
		const previousState = state;
		state = nextState;
		listeners.forEach(listener => listener(state, previousState));
	}

	return {
		getState,
		subscribe,
		listeners,
		setState,
	};
}

export type StoreApi<T> = ReturnType<typeof createStore<T>>;
