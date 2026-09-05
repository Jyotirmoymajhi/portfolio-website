// Animated favicon generated from jyotirmoy-vector-loop.mp4
const faviconFrames = Array.from({ length: 30 }, (_, i) =>
  `/favicons/frames/favicon-${String(i + 1).padStart(2, "0")}.png`
);

const faviconLink =
  document.querySelector('link[rel="icon"]') || document.createElement("link");
faviconLink.rel = "icon";
document.head.appendChild(faviconLink);

let faviconFrame = 0;
const FRAME_MS = 1000 / 3; // 3 FPS

setInterval(() => {
  faviconLink.href = faviconFrames[faviconFrame];
  faviconFrame = (faviconFrame + 1) % faviconFrames.length;
}, FRAME_MS);
