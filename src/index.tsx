import React, { useEffect } from "react";
import useSyncExternalStoreExports from 'use-sync-external-store/shim/with-selector';
import { shallow, useShallow } from "./shallow";
import { createStore, StoreApi } from './store';

const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports

const EMPTY: unique symbol = Symbol();

const identity = <T,>(arg: T): T => arg;


export interface ContainerProviderProps<State = void> {
	initialState?: State;
	children: React.ReactNode;
}

export interface Container<Value, State = void> {
	Provider: React.ComponentType<ContainerProviderProps<State>>;
	useContainer: <StateSlice = Value>(
		selector?: (state: Value) => StateSlice,
	) => StateSlice;
}

export function createContainer<Value, State = void>(
	useHook: (initialState?: State) => Value,
): Container<Value, State> {
	const Context = React.createContext<StoreApi<Value> | typeof EMPTY>(EMPTY);

	function Provider(props: ContainerProviderProps<State>) {
		const value = useHook(props.initialState);
		const store = React.useRef(createStore(value)).current;

		useEffect(() => {
			if (!shallow(value, store.getState())) {
				store.setState(value);
			}
		}, [value]);

		return (
			<Context.Provider value={store}>
				{props.children}
			</Context.Provider>
		);
	}

	function useContainer<StateSlice>(
		selector: (state: Value) => StateSlice = identity as any,
	): StateSlice {
		const store = React.useContext(Context);
		if (store === EMPTY) {
			throw new Error("Component must be wrapped with <Container.Provider>");
		}

		const slice = useSyncExternalStoreWithSelector(
			store.subscribe,
			store.getState,
			store.getState,
			selector,
			shallow
		);
		React.useDebugValue?.(slice);
		return slice;
	}

	return { Provider, useContainer };
}
