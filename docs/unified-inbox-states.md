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

---

# Platform-style recreation (page `123`)

The same states redrawn inside the real Hospiria Platform inbox, matched to the
`Inbox July 2026` designs on the reference page.

**Figma:** [Platform → page `123`](https://www.figma.com/design/HxdFjKuMtRVGVfrO2FYUC0/Platform?node-id=15012-66455)
**Reference followed:** [page `456` → `Inbox July 2026`](https://www.figma.com/design/HxdFjKuMtRVGVfrO2FYUC0/Platform?node-id=15012-66456)

Twelve 1440×900 screens in two sections. The Hospiria nav and the Airbnb /
WhatsApp / email / notes icons are cloned from the reference screens, so they are
the real assets rather than stand-ins.

## Section — Enquiries in the Inbox (`15016:9397`)

| Frame | Node | What it shows |
|---|---|---|
| E1 · Lead thread | `15016:9345` | Type filter on Enquiries, amber LEAD row selected, enquiry panel, restricted template picker |
| E2 · Request to book | `15018:9387` | Countdown chips on row and header, in-thread expiry banner, request panel with Accept/Decline |
| E3 · Unassigned inbound | `15018:9779` | Unassigned filter, Link to booking as the header's primary action, ranked matches panel |
| E4 · Post-merge booking thread | `15021:9619` | Undo-merge banner, both timeline dividers, full booking panel |

## Section — Email compose (`15016:9398`)

| Frame | Node | What it shows |
|---|---|---|
| M1 · Inline compose (Option A) | `15021:10036` | To/CC/Subj docked in the thread; Sent, Failed–Retry and Bounced bubble states |
| M2 · Expand to modal | `15022:9790` | Same draft promoted over a dimmed thread, Send enabled |
| M3 · Modal-first (Option B) | `15022:10176` | Plain bar + Compose email button; modal with Send disabled |
| M4 · Template autofill | `15025:9965` | Picker open, subject and body filled and tinted, merge fields resolved |
| M5 · Unassigned queue | `15025:10181` | The queue with a count, nothing selected |
| M6 · Link to booking | `15027:10018` | Search, three ranked bookings, move-earlier-mail choice |
| M7 · Empty state | `15027:10143` | Unassigned is clear, mirroring the reference's "All caught up" |
| M8 · Unlink & relink | `15027:10533` | Thread ··· menu open, with the resulting toast |

## Platform tokens used

Untitled UI, font **Rubik** (Regular / Medium / Bold), type at 12/18, 14/20, 16/24, 20/30.

- **Brand** `#005c59` solid, `#006b5e`, tint `#f4fcf7`, border `#90f0c9`, mint `#c6f7df`
- **Text** `#101828` / `#344054` / `#475467` / `#667085`, disabled `#98a2b3`
- **Border** `#d0d5dd` primary, `#eaecf0` secondary · **Background** `#ffffff` / `#f9fafb` / `#f2f4f7`
- **Utility** success `#ecfdf3`/`#079455` · error `#fee4e2`/`#d92d20` · warning `#fffaeb`/`#b54708` · indigo `#eef4ff`/`#3538cd` · blue-light `#0086c9` · purple `#7a5af8`
- Radius 4 (chips) / 6 (buttons, pills) / 8 (cards) / 12 (modals); shadow-xs `0 1 2 rgba(16,24,40,.05)`
- Panes 325 / 851 / 264 under a 54px nav; rows padded 10/13 with gap 9; chips padded 1/6; pills padded 2/9

### Enquiry types mapped onto the Platform palette

| Type | Chip | Rationale |
|---|---|---|
| Lead | `#fffaeb` / `#b54708` | warning — needs attention, no deadline |
| Request to book | `#fee4e2` / `#d92d20` | error — expires, costs response rate |
| Direct enquiry | `#f0f9ff` / `#0086c9` | blue-light — informational |
| Unassigned | `#f2f4f7` / `#475467` | gray — no booking context yet |

Selected rows keep the reference's `#f4fcf7` tint with a 3px `#17b26a` left accent.

---

# Enquiry states, annotated (page `000`)

Enquiry-only documentation, drawn in the refined enquiry direction and annotated
with the reasoning behind each decision.

**Figma:** [Platform → page `000`](https://www.figma.com/design/HxdFjKuMtRVGVfrO2FYUC0/Platform?node-id=15056-10082)
**Direction followed:** [enquiry screen `15034:96426`](https://www.figma.com/design/HxdFjKuMtRVGVfrO2FYUC0/Platform?node-id=15034-96426)

Each state is a 1440×900 screen with numbered pins that match a column of
annotation cards beside it.

## Section — Enquiry states, annotated (`15059:9354`)

| State | What it documents |
|---|---|
| S1 · Lead | Property and dates known, no offer. Ten pins: type accent, reserved badge slot, the hairline, the banner, the ENQUIRY divider, panel strip, dual references, parsed fields, availability, single primary action |
| S2 · Direct enquiry | No property or dates. Identity fallback, "Not stated" over hiding, availability that refuses to guess, demoted primary |
| S3 · Request to book | Live countdown, deadline-first sort, decision in banner and panel, both costs stated, "replying is not accepting" |
| S4 · Request expired | Actions removed rather than disabled, grey accent with the badge intact, attribution, "the dates were never blocked", recovery path |
| S5 · Converted to booking | Both dividers kept, 30-day undo in the banner, enquiry reference retained, type flip, panel trades availability for money |
| S6 · Closed lost | Tag over type, dimming as sorting, attribution, auto-reopen on reply, the unlikely door left open |
| S7 · Enquiries filter · empty | One filter for three types, no zero badges, deadline-first sort, empty copy, booking filters hidden not disabled |
| S8 · Create booking | Prefilled from parsed data, every field editable, consequences before the click, undo window named up front, verb-matched button |

## Section — Enquiry model (`15059:9355`)

- **Lifecycle** (`15067:9482`) — enquiry → lead → booking; request → booking or expired; any live thread → closed lost → reopened.
- **Type tokens** (`15066:9582`) — accent, badge fill/border/text, when each type applies, its primary action, and whether it may show a countdown.
- **Decision log** (`15066:9646`) — the ten rules every state satisfies.

## Type tokens as drawn

| Type | Accent | Badge fill · border | Badge text |
|---|---|---|---|
| Lead | `#7a5af8` | `#f4f3ff` · `#bdb4fe` | `#6938ef` |
| Enquiry | `#0ba5ec` | `#f0f9ff` · `#7cd4fd` | `#026aa2` |
| Request | `#f79009` | `#fffaeb` · `#fedf89` | `#b54708` |
| Booking | `#006b5e` | `#f4fcf7` · `#90f0c9` | `#005c59` |
| Closed | `#d0d5dd` | `#f9fafb` · `#d0d5dd` | `#667085` |

Badges are 16px tall, radius 2, 10px Rubik Medium. The second slot on the badge
line is reserved for a countdown (warning pill) or a booking reference (grey
pill) and stays empty otherwise. Selected rows fill `#f4fcf7`.

Layout: panes **325 / 697 / 418** under the 54px nav (the sidebar takes the
shared component's real width, and the thread pane gives up the difference);
rows 324×114 with a 3px accent, a 12px pad and a hairline between the meta block
and the preview; bubbles radius 8 with `#ffffff` inbound and `#effff5` outbound
on `#e5e7eb`; filter tabs in a 300×32 white capsule with the active tab a solid
`#006b5e` pill.

## Right sidebar

Rebuilt to match the **Unified sidebar** components in
[Shared components](https://www.figma.com/design/0ePTVTQLGkiNSxaImq3F8K/Shared-components?node-id=0-1)
rather than the narrower panel in the enquiry direction file.

| Part | Spec |
|---|---|
| Frame | 418 wide, white, 1px `#e4e6e7` left border |
| Status strip | 40 tall, 24px sides, type-tinted fill, label Rubik Bold 11 with a right-aligned status line |
| Tabs | 48 tall, 24px sides, 20px gap — General / Extras / Guest / Property / Ask AI; Rubik Bold 13, active `#014f45` over a 2px `#006b5e` underline, inactive `#667085` |
| Section | 24px padding, 18px gap under a Rubik Medium 11 `#7a8288` label, rows 5px apart, bottom border `#e4e6e7` |
| Detail row | 370×40, radius 12, fill `#f3f2ee`, 8px padding, 26px white circular icon badge, label Rubik Medium 13 `#1a1f1e`, trailing tag / value / copy / arrow |
| Status row | 370×44, radius 12, 28px white circular icon, label Rubik Medium 10 over value Rubik SemiBold 13; green `#c6f7df`/`#15803d`, red `#fee4e2`/`#d92d20`, amber `#fef0c7`/`#b54708`, grey `#f2f4f7`/`#475467` |
| Footer | 24px sides, a 46×46 `⋮` overflow button and one filled `#006b5e` action, top border `#e4e6e7` |

The strip fill carries the type: lead `#e9e6ff`, enquiry `#b9e6fe`, request
`#fef0c7`, booking `#c6f7df`, closed `#eaecf0`.

Two consequences worth noting: availability and expiry are now expressed as
**status rows** rather than a bespoke calendar strip, and the footer carries a
single filled action with the secondary ones in the `⋮` — so Decline stays in
the in-thread banner where its cost is explained.

---

## Annotations rewritten in plain English

All 47 annotation cards, the lifecycle diagram, the token table and the
decision log were rewritten with short sentences and everyday words, and
without English idioms.

## Built on the Hospiria DS library

The **Hospiria DS** library (`lk-522c0c73…`) is subscribed to the Platform file.
These parts are now real library instances instead of hand-drawn frames:

| Part | DS component | Configuration |
|---|---|---|
| All buttons | `Buttons/Button` | Primary for the filled action, Secondary gray for the rest, `State=Disabled` for the inactive Send; `sm` in headers and banners, `lg` in the sidebar footer |
| Decline | `Buttons/Button destructive` | `Hierarchy=Secondary`, `sm` |
| Type and status badges | `Badge` | `Type=Pill outline`, `Size=sm` — Purple = lead, Blue light = enquiry, Warning = request and countdown, Brand = booking, Gray = closed and booking reference |
| List filters | `Horizontal tabs` | `Type=Button primary`, `Size=sm`, `Current=True` on the active tab |
| Sidebar tabs | `Horizontal tabs` | `Type=Underline`, `Size=sm` |
| Search field | `Input field` | `Size=sm`, `Type=Icon leading`, `State=Placeholder`, icon swapped to `search-lg` |

Still drawn by hand, because the library publishes no component for them:
thread list rows, the sidebar detail and status rows, in-thread banners,
message bubbles, the ENQUIRY / BOOKING dividers and the small row avatars.
These are built from DS variables (Rubik type ramp, brand and utility colours,
radius and spacing tokens) and from the two reference files.

### One consequence

At the design system's own tab size, only **four** filters fit the 325px list
pane, not five. The mock shows All / Mine / Unassigned / Enquiries and moves
Resolved into the filter icon. Annotation 6 on S7 records this — if all five
are needed, the strip has to scroll or the list pane has to be wider.
