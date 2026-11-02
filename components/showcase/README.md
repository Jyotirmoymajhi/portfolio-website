# Project showcase

Edit `projects.ts` for all project copy, artwork, alt text and destinations. Content was verified against the existing portfolio; WebP files in `public/images/showcase` are optimized copies of its original artwork.

`ProjectShowcase` owns one card shell and one keyed content grid. Motion's `AnimatePresence mode="wait"` removes outgoing content before mounting the incoming project. Thumbnails and navigation remain mounted to retain keyboard focus. Arrow keys work when focus is inside the card.

On desktop, a 360svh section supplies natural scroll distance. Scroll progress, with hysteresis and a short debounce, selects the project. Button navigation moves the scroll position to the selected project's interval. No wheel or touch events are intercepted. Below 768px wide, the card uses ordinary document flow and button navigation. Reduced motion removes transition durations.

The existing Vinext App Router setup and Vercel configuration are retained. Run `npm run dev`, `npm run typecheck`, `npm run build`, and `npx playwright test tests/showcase.spec.ts`. Older project-motion tests target the replaced stacked implementation and are not acceptance tests for this showcase.
