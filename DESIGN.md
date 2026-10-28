# Story Forge workbench

The released editor uses a dark blurred band photograph, glass controls and the pink #e981be accent. Mode: Operate. The artwork is the primary surface; keep tool labels accessible without visible hover balloons or unnecessary headings.

Desktop: centered artwork, compact vertical format dock at left 24px, media palette immediately beside it, export in the header. Small gear belongs to the lower-right of the artwork. In multi-board mode the gear appears only when a page is expanded. Desktop boards fit a grid, up to six per supported format.

Mobile: 44px circular bottom navigation and header export, safe areas respected. One Informativo/Polaroid is centered; multiple pages become full-size vertical scrolling cards. Artwork continues behind the dock with a fixed gradient backdrop blur. Expanded editing removes this mask and return restores the selected scroll position. Preserve scroll gestures, touch targets and keyboard viewport handling.

Preview and export use the same canvas renderer. Stories has reduced texture above the midpoint. Export review includes changed art plus closing; Stories/Reels always exports alone. Deliver separate files, with native multi-file save/share where supported and individual download links for recovery.

Motion is interruptible and restrained: desktop board continuity, opacity-only mobile scroll transitions, and reduced-motion handling. Keep the background independent of the clipped editor shell. No visible StoryForge wordmark in the page header; the supplied wordmark is the PWA icon.

Collage: free overlapping diagonal, trapezoid and torn photo cutouts, with no circular photo masks. Preserve Feed textures and logo, with a dark lower gradient and no artwork blur. Selecting a photo permits bounded pan and zoom from 100–400% inside its fixed cutout; selection controls never enter the PNG. Undo/redo restores framing. Dock order ends in Collage, Closing. Show a beta warning only on mobile when entering Collage, once per page load. Load collage demo media on first entry.
