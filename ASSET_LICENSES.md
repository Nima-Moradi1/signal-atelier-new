# Asset Licenses and Provenance

## Original project assets

The signal sculpture, interface composition, gradients, icon, and Open Graph artwork are generated from source code and CSS in this repository. The 3D workstation uses procedural geometry and the original generated painting documented below; it does not embed third-party models, video, or audio.

## Generated assets

- `public/assets/hero/senior-engineer-systems-painting.webp` — original mixed-media systems-architecture artwork generated for this portfolio with OpenAI's built-in image-generation tool on July 19, 2026. It was prompted without third-party logos, readable text, or stock imagery, then locally resized and encoded as WebP. The exact “Senior Software Engineer” title is rendered separately by the application for clarity.

## Fonts

- **Geist Sans** and **Geist Mono** are loaded through `next/font` and bundled into the production build. Geist is published by Vercel under the SIL Open Font License 1.1. See the [Geist repository](https://github.com/vercel/geist-font).
- **Vazirmatn** is loaded through `next/font` for Persian UI and the repository includes `src/assets/fonts/Vazirmatn-Regular.ttf` for localized Open Graph rendering. Vazirmatn is published under the SIL Open Font License 1.1. See the [Vazirmatn repository](https://github.com/rastikerdar/vazirmatn).

## Icons

- Interface icons come from [Lucide](https://lucide.dev/), distributed under the ISC License.

## Runtime libraries

Third-party source dependencies retain their respective licenses. The principal libraries are Next.js, React, Three.js, React Three Fiber, Drei, Motion, React Hook Form, Zod, and clsx. See their package metadata and lockfile for exact versions and license declarations.

## User-provided assets

- `public/assets/nima-moradirad.jpg` — portrait extracted from the résumé supplied by Nima Moradirad; used as personal portfolio content.
- `public/nima-moradirad-resume.pdf` and its optimized WebP preview — the one-page professional résumé supplied by Nima Moradirad for public portfolio use.
- `public/assets/projects/xo-arena/*` — WebP captures and optimized H.264/VP9 derivatives of the XO Arena screenshots and recording supplied by Nima Moradirad.
- `public/assets/projects/emerald-case/homepage.jpg` — portfolio capture of Nima Moradirad's Emerald Case project from its public project URL.
- `public/assets/projects/hesabo/homepage.jpg` — portfolio capture of the public Hesabo product site representing Nima Moradirad's production work.

No third-party stock imagery is included. Personal résumé, portrait, and XO Arena media rights remain with Nima Moradirad.
