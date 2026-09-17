import React, { useRef, useEffect, useState } from 'react';
import { sound } from '../utils/audio';

export function CameraApp() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Kamera erişimi reddedildi veya cihazda kamera bulunamadı.');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    sound.playClick();
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror the image context so it saves exactly as seen on screen
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setPhoto(canvas.toDataURL('image/png'));
      }
    }
  };

  const clearPhoto = () => {
    sound.playClick();
    setPhoto(null);
  };

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden select-none">
      {error ? (
        <div className="text-white text-center p-6 bg-gray-900 rounded-lg border border-gray-700">
          <i className="fa-solid fa-camera-slash text-4xl text-red-500 mb-4"></i>
          <h2 className="text-xl font-bold mb-2">Kamera Hatası</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      ) : photo ? (
        <div className="relative w-full h-full flex flex-col bg-gray-950">
          <img src={photo} alt="Çekilen Fotoğraf" className="flex-1 object-contain w-full h-full" />
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
            <button 
              onClick={clearPhoto} 
              className="px-6 py-2.5 bg-gray-800 text-white rounded-full hover:bg-gray-700 shadow-xl border border-gray-600 transition-colors flex items-center"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i> Geri Dön
            </button>
            <a 
              href={photo} 
              download="Kamera_Fotograf.png" 
              className="px-6 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-500 shadow-xl border border-blue-400 transition-colors flex items-center"
            >
              <i className="fa-solid fa-download mr-2"></i> Kaydet
            </a>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-col bg-black">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="flex-1 object-cover w-full h-full transition-opacity duration-300"
            style={{ transform: 'scaleX(-1)' }}
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute top-4 right-4 flex gap-2">
             <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-xs border border-white/20">
               <i className="fa-solid fa-circle text-red-500 mr-2 animate-pulse"></i>
               CANLI
             </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center">
            <button 
              onClick={takePhoto}
              title="Fotoğraf Çek"
              className="w-16 h-16 bg-white/20 backdrop-blur-md border-4 border-white rounded-full flex items-center justify-center hover:bg-white/40 transition-all active:scale-90 group"
            >
              <div className="w-12 h-12 bg-white rounded-full transition-transform group-hover:scale-95 group-active:scale-90 shadow-sm"></div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
