# StoryForge studio interface

The artwork leads. Preserve the LPZ templates, AMOLED mobile background, neutral glass surfaces, pink (#e981be) action/selection accent, and restrained SVG icons.

Mobile is a distinct touch workspace defined by `studio-ui.js` and `studio-ui.css`: five stable navigation cells (four formats plus export), a separate context toolbar, and one open panel at a time. Touch targets are at least 44 px. Short labels replace hover-only descriptions. Opening a panel reserves preview space; the keyboard uses visual-viewport measurements and temporarily hides navigation. Landscape touch devices remain in the mobile workspace.

Desktop keeps the floating format dock and contextual media attachment. Upload, text, circle, effects, and video panels share header, dismissal, surface, spacing, and focus treatment across both layouts. Text remains editable by clicking/tapping the artwork.

Canvas previews and exported files share the artwork renderers. `artwork-effects.js` provides a cached raster blur independent of browser Canvas filter support. Keep textures separate from the blurred photo so their grain stays sharp. Informative artboard thumbnails use the same renderer as the active artboard and export.

Verify touch editing, native upload selection, focus restoration, viewport changes, navigation hit areas, five informative pages, image/video export, and blur in both Chromium and WebKit. A simulated mobile viewport does not constitute a physical iPhone test.
