import React, { useRef, useEffect } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import './ObjectDetection.css';

// Add setFlag as a prop
const ObjectDetection = ({ setFlag }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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
        predictions.forEach(prediction => {
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

          if (prediction.class === 'person') {
            personDetected = true;
          }
        });

        // Use the passed setFlag prop
        if (personDetected) {
          setFlag(1);
        } else {
          setFlag(0);
        }

        requestAnimationFrame(detectObjects);
      };

      if (navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        await video.play();
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        detectObjects();
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
    </div>
  );
};

export default ObjectDetection;
