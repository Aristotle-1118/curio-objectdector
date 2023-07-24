import React, { useRef, useEffect } from "react";
export class videocomponent{
     VideoComponent = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        // 获取用户摄像头视频流
        const getVideoStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            });
            if (videoRef.current) {
            videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
        };

        getVideoStream();
    }, []);

    return (
        <div>
        <video ref={videoRef} autoPlay playsInline />
        </div>
    );
    };
}

// export default VideoComponent;
