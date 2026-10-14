# StoryForge studio interface

The artwork leads. Preserve the LPZ templates, AMOLED mobile background, neutral glass surfaces, pink (#e981be) action/selection accent, and restrained SVG icons.

Mobile shares the desktop glass dock: four format icons, effects, export, and the contextual media attachment. Touch targets remain at least 44 px with no permanent text labels. Below 371 px, the media attachment opens above its format icon to preserve button sizes. Mobile panels still use the touch layout in `studio-ui.js` and `studio-ui.css`, with one open panel at a time. Opening a panel reserves preview space; the keyboard uses visual-viewport measurements and temporarily hides the dock. Landscape touch devices remain in the mobile workspace.

Desktop keeps the floating format dock and contextual media attachment. Upload, text, circle, effects, and video panels share header, dismissal, surface, spacing, and focus treatment across both layouts. Text remains editable by clicking/tapping the artwork.

Informative artboards scroll vertically on mobile, with the add-page control below the last board. Desktop retains horizontal artboards. Mobile export has extra space around its divider.

Canvas previews and exported files share the artwork renderers. `artwork-effects.js` provides a cached raster blur independent of browser Canvas filter support. Keep textures separate from the blurred photo so their grain stays sharp. Informative artboard thumbnails use the same renderer as the active artboard and export.

Verify touch editing, native upload selection, focus restoration, viewport changes, navigation hit areas, five informative pages, image/video export, and blur in both Chromium and WebKit. A simulated mobile viewport does not constitute a physical iPhone test.
