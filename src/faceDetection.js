import * as faceapi from './face-api.min.js'; // Update the path to the face-api.min.js file



// Load face-api.js models
export const loadModels = async () => {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('./models')
    ]);
  };
  
  // Detect faces in the video stream
  export const getFullFaceDescription = async (canvas, video) => {
    if (!!video.srcObject) {
      const fullDesc = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();
  
      if (!!fullDesc) {
        const resizedResults = faceapi.resizeResults(fullDesc, video);
        faceapi.draw.drawDetections(canvas, resizedResults);
      }
    }
  };