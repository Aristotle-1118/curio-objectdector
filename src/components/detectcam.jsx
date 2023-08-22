import React, { useRef, useEffect, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import "./ObjectDetection.css";
import { Box, Button, Container, Stack } from "@mui/material";
import { Curio } from "../services/curioServices";
import { DataType, PeerData } from "../services/types";
import { videocomponent } from "./cameracontral";
// import Camera from "../components/truecameracontral"
import { useNavigate } from "react-router-dom";

// Add setFlag as a prop
const ObjectDetection = ({ sendMessage }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const curio = new Curio();
  const [flag, setFlag] = useState(1);
  // const [xh,setxh]= useState(0)

  // const [yh,setyh]= useState()
  let xh = 0
  let yh = 0
  let distanceh = 800
  // let flag = 0
  // const [distanceh,setdistanceh]= useState(0) 
  const [alopen,setalopen] = useState(1)



  const handleMove = (x, y, distance) => {
		if (sendMessage) {
			const moveData = {
				type: DataType.CURIO_MOVE_VECTOR,
				data: { x: x, y: y, speed: distance },
			};
			sendMessage(moveData);
      console.log("handle main"); 
      curio.setParameters(x, y, distance);
      curio.move();

		} else {
			curio.setParameters(x, y, distance);
				curio.move();
        console.log("handle else"); 

			
		}

		
	};
  const finalmove = (x,y,distance) => {
    if (sendMessage) {
      const moveData = {
        type: 2,
        data: { x: x, y: y, speed: distance },
      };
      
      sendMessage(moveData);
      curio.UART.write(`go(${x}, ${y}, ${z})\n`, () => {});
    } else {
      curio.UART.write("go(1000, 1000, 600)\n", () => {});
    }
  };
  const sendCoordinates = (x, y, z) =>{
    curio.UART.write(`go(${x}, ${y}, ${z})\n`, () => {});
}

  const goLeft = () => {
    if (sendMessage) {
      const moveData = {
        type: 2,
        data: { x: 0, y: 1000, speed: 600 },
      };
      
      sendMessage(moveData);
      curio.UART.write("go(1000, -1000, 600)\n", () => {});
      // handleMove(xh,yh,distanceh)
    } else {
      curio.UART.write("go(1000, 0, 600)\n", () => {});
    }
  };

  const goRight = () => {
    if (sendMessage) {
      const moveData = {
        type: 2,
        data: { x: 1000, y: 0, speed: 600 },
      };
      sendMessage(moveData);
      curio.UART.write("go(-1000, 1000, 600)\n", () => {});

    } else {
      curio.UART.write("go(0, 1000, 600)\n", () => {});
    }
  };

  const goForward = () => {
    if (sendMessage) {
      
      const moveData = {
        type: 2,
        data: { x: 1000, y: 1000, speed: 600 },
      };
      sendMessage(moveData);
      curio.UART.write("go(1000, 1000, 600)\n", () => {});
      console.log("inside 1Going forward");
    } else {
      curio.UART.write("go(1000, 1000, 600)\n", () => {});
      console.log("inside 2Going forward")
      ;
    }
  };
    useEffect(() => {
      let intervalId;
  
      if (flag === 1) {
        intervalId = setInterval(() => {
          if (flag === 1) {
            console.log("Going forward"); // 标记转向方向直走
            // goForward();
            // finalmove = (1000,1000,600)
            sendCoordinates(xh,yh,distanceh)
          }
        }, 1000)}},[xh,yh,distanceh, goForward, goLeft, goRight,sendCoordinates]);
  // useEffect(() => {
  //   let intervalId;

  //   if (flag === 1) {
  //     intervalId = setInterval(() => {
  //       if (flag === 1) {
  //         console.log("Going forward"); // 标记转向方向直走
  //         // goForward();
  //         // finalmove = (1000,1000,600)
  //         sendCoordinates(xh,yh,distanceh)
  //       }
  //     }, 1000);
  //   } else if (flag === 0) {
  //     intervalId = setInterval(() => {
  //       if (flag == 0) {
  //         console.log("Going left"); // 标记转向方向左转
  //         goLeft();
  //         // handleMove(1000,0,600)
  //       }
  //     }, 1000);
  //   } else if (flag === 2) {
  //     intervalId = setInterval(() => {
  //       if (flag == 2) {
  //         console.log("Going right"); // 标记转向方向右转
  //         goRight();
  //       }
  //     }, 1000);
  //   } else if (flag === 3) {
  //     intervalId = setInterval(() => {
  //       if (flag == 3) {
  //         // console.log("smoooth Going right"); // 标记转向方向右转
  //         sendCoordinates(xh,yh,distanceh)
  //       }
  //     }, 1000);
  //   }else if(flag === 4){
  //     sendCoordinates(xh,yh,distanceh)
  //   }

  //   return () => {
  //     if (intervalId) {
  //       clearInterval(intervalId);
  //     }
  //   };
  // }, [flag,xh,yh,distanceh, goForward, goLeft, goRight,handleMove]);

  useEffect(() => {
    const runObjectDetection = async () => {
      const model = await cocoSsd.load();
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      const detectObjects = async () => {
        const predictions = await model.detect(video);
        context.clearRect(0, 0, canvas.width, canvas.height);

        let personDetected = false;
        predictions.forEach((prediction) => {
          if (prediction.class === "person") {
            context.beginPath();
            context.rect(
              prediction.bbox[0],
              prediction.bbox[1],
              prediction.bbox[2],
              prediction.bbox[3]
            );
            context.lineWidth = 2;
            context.strokeStyle = "red";
            context.fillStyle = "red";
            context.stroke();
            context.fillText(
              `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
              prediction.bbox[0],
              prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
            );

            const personLeft = prediction.bbox[0];
            const personRight = prediction.bbox[0] + prediction.bbox[2];
            const oneThird = video.videoWidth / 3;
            const twoThirds = (2 * video.videoWidth) / 3;
            const centerX = prediction.bbox[0] + prediction.bbox[2] / 2;
        
            // 将视频的width分为180个部分，并为每个部分分配一个编号
            const sectionWidth = video.videoWidth / 180;
            const sectionNumber = Math.ceil(centerX / sectionWidth); // 根据中心位置确定它在哪一个编号区域

            const lowerBound = (7/18) * video.videoWidth;
    
            const upperBound = (11/18) * video.videoWidth;
              //设置开关
            // setalopen(1)
          //   if (alopen==1 && centerX > lowerBound && centerX < upperBound) {
          //     setFlag(1);//持续直行
          // } else if (alopen==1 && centerX <= lowerBound) {
          //     setFlag(3);//flag=3顺滑左转
          //     const delta = 90 - sectionNumber;
          //     setxh(delta * 11);
          //     setyh(-delta * 11);
          // } else if (alopen==1 && centerX >= upperBound) {
          //     setFlag(4);//flag=4顺滑右转
          //     const delta = 90 - sectionNumber;
          //     setxh(-delta * 11);
          //     setyh(delta * 11);
          // } else {
          //     // 其他情况
          // }
      
          //   if (alopen==0 && personRight < oneThird) {
          //     setFlag(0);
          //   } else if (alopen==0 && personLeft >= twoThirds) {
          //     setFlag(2);
          //   } else if (alopen==0 && personLeft <= oneThird && personRight >= twoThirds) {
          //     setFlag(1);
          //   } else {
          //     // 其他情况
          //   }
          switch (alopen) {
            case 1:
              if (centerX > lowerBound && centerX < upperBound) {
                // setFlag(1); // 持续直行
                // flag = 1
                xh=1000
                yh=1000
                distanceh = 600
                console.log("这是中centerX的值:", centerX);
                console.log("这是中lowerBound的值:", lowerBound);
                console.log("这是中upperBound的值:", upperBound); 
                console.log("这是中flag的值:", flag);
             
              } else {
                if (centerX <= lowerBound) {
                  // setFlag(3); // flag=3顺滑左转

                  const delta = 70 - sectionNumber;
                console.log("这是左centerX的值:", centerX);
                console.log("这是左lowerBound的值:", lowerBound);
                console.log("这是左upperBound的值:", upperBound);    
                  // setxh(delta * 11);

                  xh= delta*11
                  // setyh(1000)
                  yh = -delta*11
                  // setyh(-delta * 11);
                  // setdistanceh(700)
                  distanceh = 700
                  // flag = 3
                  console.log("这是左xh的值:", xh);
                  console.log("这是左yh的值:", yh);
                  console.log("这是左distanceh的值:", distanceh);
                  console.log("这是左flag的值:", flag);


                
                } else if (centerX >= upperBound) {
                  setFlag(4); // flag=4顺滑右转

                  const delta = sectionNumber - 110;
                console.log("这是右centerX的值:", centerX);
                console.log("这是右lowerBound的值:", lowerBound);
                console.log("这是右upperBound的值:", upperBound); 
                console.log("delta:", delta); 
                // flag = 4

                // setxh(delta*11)
                // setyh(delta*11)
                //   setdistanceh(600)
                  xh= -delta*11
                  yh = delta*11
                  distanceh = 700

                  

                  console.log("这是右xh的值:", xh);
                  console.log("这是右yh的值:", yh);
                  console.log("这是右distanceh的值:", distanceh);
                  console.log("这是右flag的值:", flag);


                }
              }
              break;
            
            case 0:
              if (personRight < oneThird) {
                setFlag(0);//左转
              } else if (personLeft >= twoThirds) {
                setFlag(2);//右转
              } else if (personLeft <= oneThird && personRight >= twoThirds) {
                setFlag(1);//直行
              }
              break;
        
            default:
              // 其他情况
              break;
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
        const stream = await navigator.mediaDevices.getUserMedia({
          // video: true,
          video: {
            facingMode: 'environment' // 使用后置摄像头
          },
        });
        video.srcObject = stream;
        video
          .play()
          .then(() => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            detectObjects();
          })
          .catch((error) => {
            console.error(
              "Error occurred when trying to play the video:",
              error
            );
          });
      } else {
        console.error("getUserMedia not supported");
      }
    };

    runObjectDetection();
  }, []);

  return (
    <div className="detect-camera-page">
      <div className="video-container">
        <video
          className="video-stream"
          ref={videoRef}
          autoPlay
          playsInline
          muted
        ></video>
        <canvas className="detection-canvas" ref={canvasRef} />
      </div>
      {flag === 1 ? "Person Detected" : "No Person Detected"}
    </div>
  );
};

export default ObjectDetection;
