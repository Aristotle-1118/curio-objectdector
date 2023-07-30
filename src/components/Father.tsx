import { useEffect, useState } from "react";
// import { Joystick } from "react-joystick-component";
import { Box, Button, Container, Stack } from "@mui/material";
import { Curio } from "../services/curioServices";
import { DataType, PeerData } from "../services/types";
import { videocomponent } from "./cameracontral"
// import Camera from "../components/truecameracontral"
import ObjectDetection from "./detectcam"

type Props = {
	sendMessage: ((message: PeerData) => void) | undefined;
};

export default function JoystickControlle({ sendMessage }: Props) {
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [isMoving, setIsMoving] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);
	const videocomponen = new videocomponent();
	const curio = new Curio();
	const [flag, setFlag] = useState(0);
	let intervalId: NodeJS.Timer;

	const startGoLeft = () => {
		intervalId = setInterval(goLeft, 1000); // 运行goLeft函数每秒一次
						};

	const stopGoLeft = () => {
			clearInterval(intervalId); // 停止定期运行goLeft函数
						};
	const goLeft = () => {
		if (sendMessage) {
			const moveData = {
				type: 2,
				data: { x: 0, y: 1000, speed: 600 },
			};
			sendMessage(moveData);
		} else {
			curio.UART.write("go(1000, 0, 600)\n", () => { });
		}
	};
	
	const goForward = () => {
		if (sendMessage) {
			const moveData = {
				type: 2,
				data: { x: 1000, y: 1000, speed: 600 },
			};
			sendMessage(moveData);
		} else {
			curio.UART.write("go(1000, 1000, 600)\n", () => { });
		}
	};
	const handleConnect = () => {
		if (sendMessage) {
			const connectData: PeerData = {
				type: DataType.CURIO_CONNECT,
				data: { isConnected: isConnected },
			};
			sendMessage(connectData);
			setIsConnected(!isConnected);
		} else {
			if (!isConnected) {
				curio.connect(() => {
					console.log("Connected");
					setIsConnected(true);
				});
			} else {
				curio.disconnect(() => {
					console.log("Disconnected");
					setIsConnected(false);
				});
			}
		}
	};

	const handleMove = (x: number, y: number, distance: number) => {
		if (sendMessage) {
			const moveData: PeerData = {
				type: DataType.CURIO_MOVE_VECTOR,
				data: { x: x, y: y, speed: distance },
			};
			sendMessage(moveData);

			if (!isMoving) {
				const moveCommand: PeerData = {
					type: DataType.CURIO_MOVE,
					data: { message: "move" },
				};
				sendMessage(moveCommand);
			}
		} else {
			curio.setParameters(x, y, distance);
			if (!isMoving) {
				curio.move();
			}
		}

		setIsMoving(true);
	};

	const handleStart = () => {
		//setIsMoving(true);
	};

	const handleStop = () => {
		setIsMoving(false);

		if (sendMessage) {
			const moveData: PeerData = {
				type: DataType.CURIO_MOVE_VECTOR,
				data: { x: 0, y: 0, speed: 0 },
			};
			sendMessage(moveData);
		} else {
			curio.setParameters(0, 0, 0);
		}
	};
	useEffect(() => {
		let intervalId: NodeJS.Timer;
	  
		if (flag === 1) {
			stopGoLeft()
		  intervalId = setInterval(() => {
			goForward();
		  }, 1000);
		}
	  
		return () => {
		  if (intervalId) {
			clearInterval(intervalId);
		  }
		};
	  }, [flag, goForward]);
	  // use react hook useEffect to contral the robot to move whenever it detect the person

	useEffect(() => {
		let intervalId: NodeJS.Timer;
		

		if (isMoving) {
			if (sendMessage) {
				const moveCommand: PeerData = {
					type: DataType.CURIO_MOVE,
					data: { message: "move" },
				};
				sendMessage(moveCommand);
			} else {
				curio.move();
			}
			intervalId = setInterval(() => {
				if (sendMessage) {
					const moveCommand: PeerData = {
						type: DataType.CURIO_MOVE,
						data: { message: "move" },
					};
					sendMessage(moveCommand);
				} else {
					curio.move();
				}
			}, 1000);
		}

		return () => {
			clearInterval(intervalId);
			if (isConnected) {
				if (sendMessage) {
					const stopCommand: PeerData = {
						type: DataType.CURIO_MOVE,
						data: { message: "stop" },
					};
					sendMessage(stopCommand);
				} else {
					curio.stop();
				}
			}
		};
	}, [isMoving]);

	return (
		<Stack

			direction="column"
			justifyContent="center"
			alignItems="center"
			spacing={20}
		>

					<Button 
						onClick={() => {
							setOpen(true);
							// startGoLeft();

						}}
						
						style={
							{
								backgroundColor: "rgba(0, 61, 89, 255)",

							}

					}
					sx={{ mt: 10 }}
					variant="contained">
					{"detectcam"}
					
					
					</Button>
					{open && <ObjectDetection setFlag={setFlag} />}
					{flag === 1 ? 'Person Detected' : 'No Person Detected'}
										
			<Button
				onClick={() => {
					handleConnect();
				}}
				style={
					isConnected
						? {
							backgroundColor: "rgba(171, 61, 89, 255)",
							background: 'linear-gradient(45deg, #007BFF 30%, #00B0FF 90%)'

						}
						: {
							// backgroundColor: "rgba(61, 89, 171, 255)",
							background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
						}
				}
				sx={{ mt: 10 }}
				variant="contained"
			>
				{isConnected ? "DISCONNECT" : "CONNECT TO CURIO"}
			</Button>
			{/* <Button onClick={() => setOpen(true)}>
				camera
			</Button>
			{open && <Camera />} */}
			{/* <Button onClick={() => setOpen(true)}>
				detectcam
			</Button>
			{open && <ObjectDetection />} */}


			{/* {isConnected && (

				<Joystick
					move={(e) => {
						handleMove(e.x ?? 0, e.y ?? 0, e.distance ?? 0);
					}}
					start={() => {
						handleStart();
					}}
					stop={() => {
						handleStop();
					}}
					throttle={10}
				/>
			)} */}
			{isConnected && (
				<Button
					onClick={() => {
						// goLeft();
						startGoLeft();
						// stopGoLeft();
						
						// startGoLeft();
						// stopGoLeft();
						// handleMove(0,1000,100);
					}}
					style={
						{
							backgroundColor: "rgba(0, 61, 89, 255)",

						}

					}
					sx={{ mt: 10 }}
					variant="contained"
				>
					{"moveforward"}

				</Button>
			)}
			{isConnected && (

					<Button 
						onClick={() => {
							setOpen(true)
							startGoLeft();
							handleStop()

						}}
						
						style={
							{
								backgroundColor: "rgba(0, 61, 89, 255)",

							}

					}
					sx={{ mt: 10 }}
					variant="contained">
					{"detectcam"}
					
					
					</Button>)}
					{open && <ObjectDetection setFlag={setFlag} />}
					{/* if(ObjectDetection.) */}
				
			
			
			{/* {isConnected &&(
				// videocomponen.VideoComponent()
				Camera()
			)} */}
			

		</Stack>
	);
}

