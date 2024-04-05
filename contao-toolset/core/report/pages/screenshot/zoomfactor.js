/* 
calc zoomfactor

Original width: 1920
Original height: 975
Zoom factor: 1.25

New width = 1920 / 1.25 ≈ 1536
New height = 975 / 1.25 ≈ 780

    const zoomFactor = 1.25;

    // Original viewport dimensions
    const originalWidth = 1920;
    const originalHeight = 975;

    // Calculate new viewport size with the zoom factor
    const newWidth = Math.floor(originalWidth / zoomFactor);
    const newHeight = Math.floor(originalHeight / zoomFactor);

    const newViewport = {
      width: newWidth,
      height: newHeight,
      deviceScaleFactor: 1, // Set the device scale factor to 1 (no scaling)
    };
*/