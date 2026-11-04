# Existing-artwork breeze masks

These SVGs are alpha masks only, not new flower or leaf illustrations. Each mask uses the original 1672 by 941 coordinate system and an approximately 1-2 source-pixel feather. The component displays the identical full-size sitstick-watercolor.png through each mask, without resizing independent crops.

Regions: four left flower groups, three long-leaf groups, four upper-left leaf groups, three distant leaf groups, and two small groups of existing pathway flowers. Transform origins are local to the selected plant. At rest the images align exactly; opaque interiors preserve the original colors.

The original PNG remains unchanged. Generated traveling assets and petal effects were removed. No image generation is used for this implementation.

Motion uses stationary sampling masks and moving full-image layers. Isolated foliage masks include a small surrounding margin to cover the resting silhouette. Chest, vest edge, eyelid, path shadow, and brass masks also sample only the original PNG. The base image is never modified. All effects pause with visibility; repeating layer clocks survive project selection, while the brass accent plays once per activation.
