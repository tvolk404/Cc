# Unified Inbox — Email Channel & Enquiry States

Design states for the Unified Inbox (inbox-v3), recreated as native Figma frames.

**Figma:** [Platform → page `enq`](https://www.figma.com/design/HxdFjKuMtRVGVfrO2FYUC0/Platform?node-id=14990-66454)
File key `HxdFjKuMtRVGVfrO2FYUC0`, page `14990:66454`. Everything is auto-layout; no images or external assets.

Drawn at product scale (~1.3× the source mock): body 12–13px, secondary 11px, section labels 9px.
Full screens are 1600×980, three panes — thread list 380 / thread 880 / context panel 340.

## Turn 3 — Full screens (section `14992:8876`)

| Frame | Node | What it shows |
|---|---|---|
| 3a · Lead thread | `15004:9139` | Type filter on **Enquiries**, amber LEAD row selected, lead panel (asking-about, availability strip, source, Create booking), restricted template picker open with the "14 hidden" explainer |
| 3b · Request to book | `15005:9120` | Rose REQUEST row with countdown chip, in-thread expiry banner with Accept/Decline, request panel with availability + expiry + Accept/Decline |
| 3c · Unassigned inbound | `15006:9122` | Unassigned filter, email selected, **Link to booking** as the primary header action, panel with sender / subject / possible matches / discard |
| 3d · Post-merge booking thread | `15007:9175` | Undo-merge banner, `ENQUIRY · BEFORE BOOKING` and `BOOKING CONFIRMED · B88102` dividers, full booking panel restored (financial, history, quick actions) |

## Turn 2 — Enquiry components (section `14992:8877`)

| Frame | Node | What it shows |
|---|---|---|
| 2a · List rows | `14993:8936` | Four rows (lead / request / enquiry / unassigned), identity fallback ladder, intent line, type as a 3px left accent |
| 2b · Expiry countdown | `14994:8921` | Live row, expired row, in-thread banner |
| 2c · Filter bar with Type | `14994:8967` | Type segmented control inline with Channel; booking filters dashed at 45% opacity with the reason spelled out |
| 2d · Enquiry right panels | `14996:9059` | Lead / request / direct enquiry, each with its availability block |
| 2e · Unassigned right panel | `14997:8935` | Sender, subject, why-unassigned, ranked matches with confidence, discard |
| 2f · Restricted template picker | `14997:8984` | Only resolvable templates offered; the rest counted, not silently dropped |
| 2g · Suggested merge | `14998:8935` | Banner → confirm dialog → undo toast → recovery via thread ⋯ menu |
| 2h · Post-merge timeline | `14998:8973` | Both dividers with the merge provenance line |
| 2i · Closed & lost rows | `14994:9017` | Closed Lost as a **tag**, not a type; converted, lost and closed-without-booking |
| 2j · Empty states | `14997:9006` | No enquiries; filter that cannot apply |

## Turn 1 — Email compose states (section `14992:8878`)

| Frame | Node | What it shows |
|---|---|---|
| 1a · Inline compose (Option A, recommended) | `15000:8960` | To/Cc, Subject, B/I/Link/List, attach, Templates, sender-identity picker, Expand, Send; bubbles show Sent / Failed–Retry / Bounced |
| 1b · Expand to modal | `15000:9087` | Same draft promoted; thread visible behind the dim |
| 1c · Modal-first (Option B) | `15001:8969` | Plain bar + Compose email button; modal over dimmed thread, Send disabled (`#d1d5db`) |
| 1d · Template autofill | `15001:9073` | Picker open, subject + body filled, indigo tint on autofilled fields, merge fields resolved |
| 1e · Unassigned tab | `15002:8952` | Unassigned queue on the thread list with a count and match hints |
| 1f · Link-to-booking dialog | `15002:9008` | Search, ranked matches with the reason, one decision about the sender's earlier mail |
| 1g · Empty state | `15002:9024` | Unassigned is clear, and what happens next |
| 1h · Unlink / relink | `15002:9065` | Thread ⋯ menu and the resulting toast |

## Tokens as drawn

- **Text** `#111827` primary, `#374151` secondary, `#6b7280` muted, `#9ca3af` faint
- **Borders** `#e5e7eb`, hairlines `#f3f4f6`
- **Brand** green `#16a34a` (primary action / Send), logo block `#0c5c53`
- **Channel** Airbnb `#ff5a5f`, WhatsApp `#25d366`, Email `#4338ca` on `#eef2ff`
- **Type accents** Lead `#f59e0b` (row bg `#fffbeb`, chip `#fef3c7`/`#b45309`) · Request `#e11d48` (row bg `#fff7f7`, chip `#ffe4e6`/`#be123c`) · Enquiry `#0d9488` (chip `#ccfbf1`/`#0f766e`) · Unassigned `#9ca3af` (chip `#f3f4f6`/`#6b7280`)
- **Message states** sent `#eef2ff` on `#e0e7ff` · failed `#fef2f2` on `#fecaca`, text `#dc2626` · bounce text `#b45309`
- **Availability** free `#dcfce7`/`#166534`, booked `#fee2e2`/`#991b1b`
- **Banners** info `#eff6ff`/`#bfdbfe`/`#1d4ed8` · warning `#fff1f2`/`#fecdd3`/`#be123c` · toast `#111827`
- Type Inter 400/500/600/700/800. Radius 4–8px on cards and chips, 999px on pills. Selected row = tinted bg + 3px left accent.

## Rules the states encode

- Leads get reply and **Create booking** only — never Accept/Decline; there is nothing to accept yet.
- Requests carry a live countdown on the row, in the header and in the panel; expired rows grey out and lose their actions.
- Merging is always suggested, never automatic: banner → confirm → undo, with recovery in the thread ⋯ menu.
- Booking-scoped filters stay visible but disabled for enquiries, with the reason stated.
- A template is offered only when every merge field resolves; the rest are counted in the "hidden" explainer.
- Email bubbles report Sent / Failed / Bounced. No read ticks — email cannot report them.

## Notes

- Channel badges are simplified coloured squares; swap for the real Airbnb / WhatsApp / email icons from the Platform library.
- The source `Unified Inbox States.dc.html` was not present in this repository, so the frames were built from the handoff brief (structure, copy and tokens) rather than parsed from the markup.
