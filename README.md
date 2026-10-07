# VELORA Paris

A responsive fragrance editorial experience built with React, TypeScript, GSAP ScrollTrigger and Lenis on the Sites Vinext starter.

## Reference mapping

The supplied video is 4.3 seconds, 800×480 at 60 fps. It shows an ivory logo curtain opening vertically, a full-viewport product hero with an oversized lower wordmark, a compact fixed header, and an ivory editorial section with four asymmetrically staggered visual cards. No later sections or footer are visible in the clip.

| Reference behavior                    | VELORA implementation                                                                                              |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Ivory introduction and upward curtain | Supplied VELORA mark, fine progress line, 1.25-second upward reveal                                                |
| Product scene and large bottom brand  | Reference-derived Éclat sunset photography, live editorial copy, oversized live VELORA typography                  |
| Hero scroll continuity                | Independent image scaling/parallax, wordmark movement and copy movement                                            |
| Editorial transition                  | Ivory background, scroll-progress text emphasis                                                                    |
| Four staggered cards                  | Woods, Éclat bottle, peach and jasmine, different offsets scrubbed to scroll                                       |
| Later sections not supplied           | Consistent bottle presentation, interactive fragrance notes, brand editorial, journal, closing campaign and footer |

## Brand and assets

The image is the source for the VELORA Paris mark, Éclat 100 ml fragrance, peach/jasmine/soft-wood notes, sunset light, ivory, peach and brown palette. The logo uses the original image unchanged inside a clipped display window. The clean campaign image, bottle cutout and ingredient image were prepared from that reference using image editing, then compressed to WebP. Supporting brand and journal prose is original concept copy. No additional fragrances, prices, provenance claims or company history were invented.

## Interactions

- Responsive navigation and mobile menu; English and French copy.
- Search across the fragrance, its notes and the brand story.
- Product details and a local fragrance selection with add, remove and quantity controls.
- Selection download. There is no payment processor, live inventory or order submission.
- Keyboard-operable scent tabs and native modal focus handling.
- Device-local selection/language preferences and reduced-motion support.

## Development

Use the package manager recorded in the lockfile. Install dependencies, then run the `dev` script. Run `tsc --noEmit` for a type check and `build` for production. Hosting identity is in `.openai/hosting.json`. Assets and fonts are self-hosted. The original full photograph is retained solely to reproduce the brand mark without redrawing or distorting it.

## Image clarity and header update

All three image sources received a detail-enhancement pass and are delivered as lossless WebP to avoid adding compression blur. Native dimensions remain 1672×941 (hero), 1086×1448 (transparent bottle), and 1536×1024 (ingredients); these are not 4K assets. Versioned filenames prevent reuse of previously cached softer images. The pale header plate is removed; the hero header is transparent and the scrolled header uses a translucent warm-brown tint. The original logo pixels are displayed using a luminance-to-alpha filter, so the brand mark has no rectangular background.
