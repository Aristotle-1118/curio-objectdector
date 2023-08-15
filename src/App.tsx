import "./App.css";
import { useState } from "react";
import { Button, Stack } from "@mui/material";
import { PeerData } from "./services/types";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import JoystickController from "./components/Father";
// import cameraController from "./components/cameracontral";
import Peer, { DataConnection } from "peerjs";
import ObjectDetection from "./components/detectcam"
// import JoystickController2 from "./components/test"


function Home() {
	return (
		<div className="App">
			<>
			<JoystickController sendMessage={undefined} />
			{/* <cameraController sendMessage={undefined} /> */}
			</>
		</div>
	);
}


function HomePeer() {
	const { roomID } = useParams();
	const peer = new Peer(); // Create PeerJS instance
	const [connection, setConnection] = useState<DataConnection>(); // Store the connection
	const [isPeerConnected, setIsPeerConnected] = useState<boolean>(false);

	const peerConnection = () => {
		if (roomID) {
			console.log(roomID);

			const conn = peer.connect(roomID);
			setConnection(conn);
			console.log(conn);
			setIsPeerConnected(true);
		}
	};

	const sendMessage = (data: PeerData) => {
		if (connection) {
			console.log(data);

			connection.send(data); // Send the message to the receiver
		}
	};

	return (
		<div className="App">
			{isPeerConnected ? (
				<JoystickController sendMessage={sendMessage} />
				// <cameraController sendMessage={sendMessage} />

			) : (
				<Stack
					direction="column"
					justifyContent="center"
					alignItems="center"
				>
					<Button
						onClick={() => {
							peerConnection();
						}}
						style={{
							backgroundColor: "green",
						}}
						sx={{ mt: 10 }}
						variant="contained"
					>
						CONNECT TO THE HOST DEVICE
					</Button>
				</Stack>
			)}
		</div>
	);
}

function App() {
	const [connection, setConnection] = useState<DataConnection>(); // Store the connection
	const sendMessage = (data: PeerData) => {
		if (connection) {
			console.log(data);

			connection.send(data); // Send the message to the receiver
		}
	};
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				{/* <Route path="/:roomID" element={<HomePeer />} /> */}
				<Route path="/detect" element={<ObjectDetection sendMessage={sendMessage} />} />
				{/* <Route path="/test" element={<JoystickController2 sendMessage={sendMessage}/>} /> */}

			</Routes>
		</BrowserRouter>
	);
}

export default App;
