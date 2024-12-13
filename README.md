# Unstated Fast

Unstated-fast is an optimized, high-performance version of unstated-next. 

While unstated-next is impressive, it faces challenges when state is shared among large-scale components, as any state change in Hooks causes all related components to re-render. Unstated-fast addresses this problem gracefully by utilizing React’s new useSyncExternalStore feature.

## Install

```sh
npm install --save unstated-fast
```

## Example

```js
import React, { useState } from "react";
import { createContainer } from "unstated-fast";
import { render } from "react-dom";

function useCounter(initialState = 0) {
	let [count, setCount] = useState(initialState);
	let decrement = () => setCount(count - 1);
	let increment = () => setCount(count + 1);
	return { count, decrement, increment };
}

let Counter = createContainer(useCounter);

function CounterDisplay() {
	// component won't rerender untill count changed
	let count = Counter.useContainer((state) => state.count);

	return (
		<div>
			<span>{count}</span>
		</div>
	);
}

function CounterOperator() {
	let counter = Counter.useContainer();
	return (
		<div>
			<button onClick={counter.decrement}>-</button>
			<button onClick={counter.increment}>+</button>
		</div>
	);
}

function App() {
	return (
		<Counter.Provider>
			<CounterDisplay />
			<Counter.Provider initialState={2}>
				<div>
					<div>
						<CounterDisplay />
					</div>
				</div>
			</Counter.Provider>
		</Counter.Provider>
	);
}

render(<App />, document.getElementById("root"));
```

## API

### `createContainer(useHook)`

```js
import { createContainer } from "unstated-fast";

function useCustomHook() {
	let [value, setValue] = useState();
	let onChange = (e) => setValue(e.currentTarget.value);
	return { value, onChange };
}

let Container = createContainer(useCustomHook);
// Container === { Provider, useContainer }
```

### `<Container.Provider>`

```js
function ParentComponent() {
	return (
		<Container.Provider>
			<ChildComponent />
		</Container.Provider>
	);
}
```

### `<Container.Provider initialState>`

```js
function useCustomHook(initialState = "") {
	let [value, setValue] = useState(initialState);
	// ...
}

function ParentComponent() {
	return (
		<Container.Provider initialState={"value"}>
			<ChildComponent />
		</Container.Provider>
	);
}
```

### `Container.useContainer()`

```js
function ChildComponent() {
	let input = Container.useContainer();
	return <input value={input.value} onChange={input.onChange} />;
}
```

```js
function ChildComponent() {
	let value = Container.useContainer((state) => state.value);
	return <input value={input.value} />;
}
```
