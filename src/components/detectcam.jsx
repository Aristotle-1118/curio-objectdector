import React, { useRef, useEffect,useState} from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import './ObjectDetection.css';
import { Box, Button, Container, Stack } from "@mui/material";
import { Curio } from "../services/curioServices";
import { DataType, PeerData } from "../services/types";
import { videocomponent } from "./cameracontral"
// import Camera from "../components/truecameracontral"
import { useNavigate } from 'react-router-dom';

// Add setFlag as a prop
const ObjectDetection = ({ sendMessage }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const curio = new Curio();
	const [flag, setFlag] = useState();

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

	const goRight = () => {
		if (sendMessage) {
			const moveData = {
				type: 2,
				data: { x: 1000, y: 0, speed: 600 },
			};
			sendMessage(moveData);
		} else {
			curio.UART.write("go(0, 1000, 600)\n", () => { });
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
  useEffect(() => {
		let intervalId;
	  
		if (flag === 1) {
		  intervalId = setInterval(() => {
			if (flag === 1) {
			  console.log("Going forward"); // 标记转向方向
			  goForward();
			}
		  }, 1000);
		} else if (flag === 0) {
		  intervalId = setInterval(() => {
			if (flag == 0) {
			  console.log("Going left"); // 标记转向方向
			  goLeft();
			}
		  }, 1000);
		} else if (flag === 2) {
		  intervalId = setInterval(() => {
			if (flag == 2) {
			  console.log("Going right"); // 标记转向方向
			  goRight();
			}
		  }, 1000);
		}
	  
		return () => {
		  if (intervalId) {
			clearInterval(intervalId);
		  }
		};
	  }, [flag, goForward, goLeft, goRight]);
	  
	  
	
  useEffect(() => {
    const runObjectDetection = async () => {
      const model = await cocoSsd.load();
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      const detectObjects = async () => {
        const predictions = await model.detect(video);
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        let personDetected = false;
        // predictions.forEach(prediction => {
        //   context.beginPath();
        //   context.rect(
        //     prediction.bbox[0],
        //     prediction.bbox[1],
        //     prediction.bbox[2],
        //     prediction.bbox[3]
        //   );
        //   context.lineWidth = 2;
        //   context.strokeStyle = 'red';
        //   context.fillStyle = 'red';
        //   context.stroke();
        //   context.fillText(
        //     `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
        //     prediction.bbox[0],
        //     prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
        //   );

        //   if (prediction.class === 'person') {
        //     personDetected = true;
        //   }
        //   if (personDetected) {
        //     const personLeft = prediction.bbox[0];
        //     const personRight = prediction.bbox[0] + prediction.bbox[2];
        //     const oneThird= video.videoWidth / 3;
        //     const twoThirdWidth = 2 * video.videoWidth / 3;
        //     if (personRight < oneThird) {
        //         setFlag(0);  // 人像的右边界框位于视频的左三分之一处，车子该左转
        //     } else if (personLeft > twoThirds) {
        //         setFlag(2);  // 人像的左边界框位于视频的右三分之一处，车子该右转
        //     } else if (personLeft <= oneThird && personRight >= twoThirds) {
        //         setFlag(1);  // 人像的左右边界框分别位于视频的左三分之一和右三分之一
        //     } else {
        //         // 其他情况，例如人像完全位于中间区域时，可以根据需要设定相应的逻辑。
        //     }
  
        //   }else{
        //     setFlag(0)
        //   }
        // });
        predictions.forEach(prediction => {
          if (prediction.class === 'person') {
            context.beginPath();
            context.rect(
              prediction.bbox[0],
              prediction.bbox[1],
              prediction.bbox[2],
              prediction.bbox[3]
            );
            context.lineWidth = 2;
            context.strokeStyle = 'red';
            context.fillStyle = 'red';
            context.stroke();
            context.fillText(
              `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
              prediction.bbox[0],
              prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
            );
            
            const personLeft = prediction.bbox[0];
            const personRight = prediction.bbox[0] + prediction.bbox[2];
            const oneThird= video.videoWidth / 3;
            const twoThirds = 2 * video.videoWidth / 3;
            
            if (personRight < oneThird) {
              setFlag(0);  
            } else if (personLeft >=twoThirds) {
              setFlag(2);  
            } else if (personLeft <= oneThird && personRight >= twoThirds) {
              setFlag(1);  
            } else {
              // 其他情况
            }
          } else {
            setFlag(0);
          }
        });

        

        // Use the passed setFlag prop
        // if (personDetected) {
        //   setFlag(1);
        // } else {
        //   setFlag(0);
        // }
        // if (personDetected) {
        //   const personLeft = prediction.bbox[0];
        //   const personRight = prediction.bbox[0] + prediction.bbox[2];
      
        //   if (personRight < oneThird) {
        //       setFlag(0);  // 人像的右边界框位于视频的左三分之一处，车子该左转
        //   } else if (personLeft > twoThirds) {
        //       setFlag(2);  // 人像的左边界框位于视频的右三分之一处，车子该右转
        //   } else if (personLeft <= oneThird && personRight >= twoThirds) {
        //       setFlag(1);  // 人像的左右边界框分别位于视频的左三分之一和右三分之一
        //   } else {
        //       // 其他情况，例如人像完全位于中间区域时，可以根据需要设定相应的逻辑。
        //   }

        // }else{
        //   setFlag(0)
        // }

        requestAnimationFrame(detectObjects);
      };

      if (navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
       video.play()
    .then(() => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      detectObjects();
    })
    .catch(error => {
      console.error('Error occurred when trying to play the video:', error);
    });
      } else {
        console.error('getUserMedia not supported');
      }
    };

    runObjectDetection();
  }, []);

  return (
    <div>
      <div className="video-container">
        <video className="video-stream" ref={videoRef} autoPlay playsInline muted></video>
        <canvas className="detection-canvas" ref={canvasRef} />
      </div>
      {flag === 1 ? 'Person Detected' : 'No Person Detected'}

    </div>
  );
};

export default ObjectDetection;
