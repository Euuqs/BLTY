# Design QA — 首页视觉重构

## Evidence

- Source visual truth path: `F:\网站素材\ChatGPT Image 2026年9月8日 23_39_30.png`
- Source pixels: 1600 × 1000, treated as a 1600 × 1000 CSS-pixel desktop reference at 1× density.
- Implementation URL: `http://127.0.0.1:4174/`
- Implementation screenshot path: Codex in-app Browser task capture (tab 1; the browser capture API emitted the image into the task and did not expose a filesystem path).
- Desktop viewport / capture: 1600 × 1000 CSS px, 1× density, top-of-page, light theme.
- Mobile viewport / capture: 390 × 844 CSS px, 1× density, top-of-page, light theme.
- State: default homepage, navigation active on 首页, search closed.

## Full-view comparison evidence

The source and 1600 × 1000 implementation captures were opened and inspected in the same QA pass. Both use a single-line editorial navigation, a pale mist-white/blue ground, a left text column, a larger right photographic field, serif Chinese display typography, blue/pink accents, restrained handwritten copy, pill CTAs, and the start of the 关于她们 section within the first viewport. The implementation intentionally uses the supplied unedited `public/hero-wedding.jpg`; no face or subject generation was performed.

At 390 × 844 the implementation uses a dedicated stacked composition: two-row horizontally scrollable navigation, complete title/copy/CTA block, then a tall subject-centered portrait crop. There is no horizontal page overflow, control collision, or accidental title truncation.

## Focused region comparison evidence

- Header: logo lockup, center navigation rhythm, active underline, and right search affordance were checked at desktop and mobile widths.
- Hero typography: display size/weight, pink final character, letter spacing, line-height, body copy, and CTA sizing were checked against the reference.
- Image: subject identity, facial detail, sharpness, focal point, wedding-flower context, and desktop/mobile crop were checked at full size.
- About transition: section boundary, heading hierarchy, secondary crop, and content-count rail were checked in the desktop first viewport.

## Required fidelity surfaces

- Fonts and typography: Fraunces/Noto Serif fallbacks provide the light editorial contrast of the source; Manrope is reserved for functional UI and Great Vibes for short handwritten accents. Desktop and mobile wraps are intentional and readable.
- Spacing and layout rhythm: the 36/64 desktop split and 44rem hero height reproduce the source hierarchy while exposing the next section. Mobile changes to a stacked layout instead of scaling the desktop grid.
- Colors and tokens: default surfaces are mist white, glacier blue and pale lavender; dusty pink is limited to the title accent. Text and controls retain sufficient light-theme contrast.
- Image quality and asset fidelity: the real 1920 × 1280 supplied image is used directly with responsive object-position and no synthetic replacement, masking halo, face edit, or placeholder.
- Copy and content: the source's emotional Chinese copy direction is preserved while all existing app routes, data counts, and downstream content remain live.
- Accessibility and interaction: semantic headings, alt text, active navigation state, focus-visible CTA rings, 44px-class mobile targets, keyboard-search behavior, and reduced-motion handling are present.

## Comparison history

### Iteration 1

- [P1] Desktop hero consumed the entire first viewport, so 关于她们 did not peek into view as in the reference.
  - Fix: changed the desktop hero/photo minimum height from the full viewport to 44rem.
  - Post-fix evidence: the revised 1600 × 1000 browser capture shows the complete hero plus the top ~320px of 关于她们.
- [P2] The first capture occurred during the deliberate entry animation and appeared blank.
  - Fix: verified the settled state after animation and confirmed reduced-motion mode removes this transient state for users who request it.
- [P2] Next.js reported an LCP loading warning for the hero.
  - Fix: added explicit eager loading alongside priority.
  - Post-fix evidence: production build passed; browser error log is empty.

### Iteration 2

No actionable P0/P1/P2 differences remained in the settled desktop or mobile captures. Remaining deviations are expected product constraints: the supplied real photo has a simpler flower/background arrangement than the generated reference mock, and existing companion/floating controls remain present because they are an existing core feature outside this visual-change scope.

## Interaction verification

- Main CTA navigated successfully from `/` to `/tour`, then browser Back returned to `/`.
- Search modal opened, accepted keyboard input, and closed with Escape.
- Primary nav destinations remain real links to `/`, `/same-styles`, `/schedule`, `/feed`, and `/tour`.
- Browser console error log: empty after final route test.
- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed; all existing routes generated.

## Follow-up polish

- [P3] If a future source photo with more environmental white flowers and wider framing becomes available, it can further match the reference's airy right-edge negative space without altering the layout.

final result: passed

## Floating controls regression — 2026-09-09

- Scope: `BackToTop`, `CompanionTrigger`, feedback trigger, and keyboard-help trigger.
- Implementation: all four controls now share two safe-area-aware rails and two vertical slots from `globals.css`; modal/drawer layers remain above the trigger layer.
- Mobile evidence: at 390 × 844, the right rail measured CompanionTrigger at `bottom: 16px`, `height: 48px` and BackToTop at `bottom: 76px`, `height: 48px`, leaving a 12px gap. The left rail measured feedback at `bottom: 16px`, `height: 48px` and keyboard help at `bottom: 76px`, `height: 44px`, also leaving a 12px gap.
- Desktop evidence: at 1600 × 1000, the right rail measured CompanionTrigger at `bottom: 24px` and BackToTop at `bottom: 84px`; the left rail measured feedback at `bottom: 24px` and keyboard help at `bottom: 84px`. Both rails preserve 12px separation.
- Safe area: both vertical slots include `env(safe-area-inset-bottom)` and use a shared breakpoint edge token.
- Accessibility: all controls retain their accessible names, keyboard focusability, and 44px-or-larger target size.
- Browser state: verified after scroll-to-bottom in the settled animation state; no fixed controls overlap at either viewport.
- Validation: `npm run lint` passed; `npx tsc --noEmit` passed.

Regression final result: passed

## Tour archive QA — 2026-09-10

### Evidence

- Source visual truth: `F:\网站素材\ChatGPT Image 2026年9月8日 23_39_30.png`, 1600 × 1000 at 1× density; opened at original resolution before implementation and compared with the settled browser captures in the same QA run.
- Implementation route: `http://127.0.0.1:4174/tour`.
- Browser-rendered evidence: Codex in-app Browser captures emitted into the task for 1440 × 900, 1600 × 1000, and 390 × 844 at 1× density. The Browser API does not expose a persistent screenshot path, so no filesystem path is claimed.
- States captured: reload first frame, settled Hero, selected-stage anchor, keyboard-focused first StageCard, mobile stage list, mobile memory gallery, mobile Credits/footer safe area, and the settled homepage TourHighlight.
- HTTP fallback: `/tour` and `/` returned 200 and contain the stage archive and homepage entry.

### Full-view and focused comparison evidence

The source and implementation were checked at the same 1600 × 1000 viewport. The tour archive carries forward the source's pale blue-white ground, serif-led hierarchy, restrained cool-blue accent, asymmetric photographic composition, thin borders and generous whitespace. The archive intentionally uses the supplied live-stage photos instead of recreating the source wedding image.

Focused checks covered Hero title wrapping at all three target widths, initial route visibility, StageCard metadata/focus treatment, mobile image crops, fixed-control coexistence, footer clearance and the homepage entry. Hover and press CSS use stable transforms and shadows; focus-visible was exercised by keyboard on the first StageCard.

### Required fidelity surfaces

- Fonts and typography: Fraunces/serif display type, Manrope body copy and JetBrains Mono labels render with a clear hierarchy. Hero measures two lines at 1440, 1600 and 390; no orphaned final character remains.
- Spacing and layout rhythm: desktop Hero and asymmetric 1+2 stage grid remain balanced; mobile is single-column with 20px gutters and 52px Hero CTAs. Section rhythm is preserved without content/control collisions.
- Colors and tokens: the cool white/blue palette and fine-line borders match the selected editorial direction; homepage TourHighlight now uses the same quiet surface instead of the previous purple gradient/glow treatment.
- Image quality and asset fidelity: all eight rendered Next Image instances reported complete with non-zero natural dimensions. Hero uses priority, eager loading and high fetch priority; the supplied stage crops remain sharp and intentional.
- Copy and content: exact post-show state, 2026.08.22 date, Hangzhou location, three real video records, photo-only Cupid moment and credits are visible. Video URLs and photo credits are unchanged.
- Accessibility and interaction: semantic links retain descriptive new-window names, StageCard focus is visibly outlined, CTAs are 52px on mobile, BV remains in the accessibility tree while visually hidden on mobile, and reduced-motion removes transforms/transitions.

### Findings

No actionable P0/P1/P2 findings remain. A fresh browser tab reported no console warnings or errors. At 1440, 1600 and 390, `scrollWidth` equals `clientWidth`.

### Comparison history

- Iteration 1: source image and all supplied stage/memory photos were opened and inspected; implementation and responsive rules were completed.
- Iteration 2 findings: mobile floating controls obscured stage metadata/gallery content; Hero had an orphaned `光。`; `100vw` caused a 5px overflow; route opacity produced a blank first frame; the Hero emitted an LCP warning; mobile metadata was too dense; homepage entry retained a heavy purple card treatment.
- Iteration 2 fixes: tour-scoped footer safe area and absolute end-of-page controls; 46/54 Hero split and responsive display sizing; tour-scoped full-width main container; visible route first frame; eager/high-priority Hero loading; higher-contrast metadata with visually hidden mobile BV; editorial homepage card; stable hover/focus/press states.
- Post-fix evidence: title height equals two line-heights at all requested widths; 390 controls are absent over the scrolling archive and occupy only reserved footer padding at page end; `scrollWidth === clientWidth` at 390, 1440 and 1600; initial screenshot contains full Hero content; fresh console warnings/errors are empty; all images are complete.
- Validation: `npm run lint`, `npx tsc --noEmit`, 22 companion tests, `npm run build`, `git diff --check`, and `/tour` + `/` HTTP 200 all passed.

### Follow-up polish

No P3 issue remains from this round. Persistent desktop companion controls intentionally remain in their established site-wide rails; the tour-only page-end behavior applies only below 620px and does not alter other pages.

final result: passed
