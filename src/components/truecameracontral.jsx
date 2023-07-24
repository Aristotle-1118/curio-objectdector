import React, { useEffect, useRef } from 'react';

const Camera = () => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          let video = videoRef.current;
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error("error:", err);
        });
    }
  }, []);

  return (
    <div>
      <style jsx>{`
        .squareCamera {
          width: 300px;
          height: 300px;
          position: relative;
          overflow: hidden;
        }
        .squareCamera video {
          position: absolute;
          min-width: 100%;
          min-height: 100%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
      <div className="squareCamera">
        <video ref={videoRef} autoPlay />
      </div>
    </div>
  );
};

export default Camera;
