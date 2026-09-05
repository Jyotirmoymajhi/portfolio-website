JYOTIRMOY ANIMATED FAVICON PACK

Files:
- favicon.png        Static fallback favicon
- favicon.ico        Static fallback for older/browser compatibility (if generated)
- frames/            30 PNG animation frames, 64x64, extracted at 3 FPS
- animated-favicon.js JavaScript loop for the favicon animation

INSTALL
1. Copy the whole folder to your site's public folder as: public/favicons/
2. In <head>, add:
   <link rel="icon" type="image/png" href="/favicons/favicon.png">
3. Load the animation script before </body>:
   <script src="/favicons/animated-favicon.js"></script>

If using React/Next/Vite, import or execute the same JS client-side after the page mounts.

Note: MP4 cannot reliably be used directly as a favicon. This pack reproduces it by switching PNG frames.
