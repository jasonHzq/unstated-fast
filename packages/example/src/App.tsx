import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { createContainer } from "../../../";

function useCnt() {
	const [cnt, setCnt] = useState(0);
	const [num, setNum] = useState(0);

	return {
		num,
		cnt,
		setCnt,
		setNum,
	};
}

const CntContainer = createContainer(useCnt);

function OpChild() {
	const { setCnt } = CntContainer.useContainer((state) => ({
		setCnt: state.setCnt,
	}));
	console.log("op child render");

	return <button onClick={() => setCnt(cnt => cnt + 1)}>add cnt</button>;
}

function Child() {
	const cnt = CntContainer.useContainer((state) => state.cnt);
	console.log("child render");

	return <div>num: {cnt}</div>;
}

function App() {
	return (
		<>
			<div>
				<a href="https://vitejs.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<CntContainer.Provider>
					<OpChild />
					<Child />
				</CntContainer.Provider>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default App;
