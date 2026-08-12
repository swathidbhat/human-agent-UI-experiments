# Human–agent UI experiments

Prototypes for a goal-first agent workspace. Open `index.html` in a browser.
No build step, no dependencies, no network calls.

```
index.html              the prototype — start here
social.html             a feed-sized card of the same data, for posting
src/
  styles.css            all styling; the palette lives in :root
  data.js               vocabulary, agents, and the two seeded goals
                        (the swish game study, and growing prewave)
  app.js                behaviour; expects data.js to have loaded first
  data.codex.js         an alternate scenario set; swap it in for data.js
  social.css            the social card; imports styles.css for the palette
  social.js             builds the card from the same goals data
explorations/
  ten-aesthetics.html   ten visual treatments of the same task queue
  split-and-map.html    three ways to make "needs you" prominent, plus ten map layouts
  font-pairings.html    the same screen in ten type pairings, all system-installed
docs/
  concept-summary.md    the original model this was built from
```

Editing is meant to be obvious: change a colour in `src/styles.css`, change the
seeded work in `src/data.js`, change how it behaves in `src/app.js`.

## The model

Every task is in exactly one of three states, and there is no fourth:

- **Needs you** — a decision or action is needed from you.
- **Working** — an agent can continue without you.
- **Completed** — the task produced something ready to use.

Work an agent cannot continue is not a separate state. It is named inside the
decision that is holding it up. Adding work is an action, never a state: new work
inherits everything the agents have worked out so far and carries on from there.

## What the prototype does

- Decisions are real. Each shows two options with their consequences, one marked
  recommended. Clicking one commits immediately and the row that appears offers
  an undo, rather than gating the choice behind a confirm step.
- Numbers are traceable. A decision built on an agent's findings links back to
  the run that produced them.
- Every agent update can be rated, and every completed artifact opens to its
  result, the reasoning, and its sources.
- The three counts at the top double as filters.
- The greeting is workspace-level, not goal-level, so it sits in a pinned band
  above the whole frame and does not change when you switch goals.
- A task is live work, not a record. Clicking a row opens the feed of the agent
  doing it, focused on that task, rather than a properties panel.
- Stages is derived from the tasks themselves, so the two views cannot disagree.
  Connectors are drawn for both kinds of dependency: what a decision is holding
  up, and what it was built on.
- The Stages panel is a surface, not a fourth column, and a notch on its edge
  points at the node it is describing. A decision can be made from it, so
  "needs you" is never just an announcement.

## Design constraints it was built under

- Three states, mutually exclusive and collectively exhaustive.
- Plain language throughout: no branch, node, route, artifact, or proof-of-work.
- No box carries a fill and a border of different colours.
- Colour comes from Andalusian azulejo: cobalt, pale glaze, cream and terracotta
  grout. The tile appears in four places, all of them quiet: a border course down
  the left edge, glaze texture on the surface that needs you, each agent as its
  own motif, and progress laid in courses with grout between them. A completed
  task is a single tile, set in green.
- No neutral greys anywhere. Secondary text is tinted plum. States are raspberry
  (needs you), near-black (working), and emerald (completed).
- Rules only where they separate something. Space does the rest.
- One typeface, Avenir Next, with weight and size carrying the hierarchy.

## Published

The cockpit, as a private artifact:
https://claude.ai/code/artifact/e4ad5d13-446d-4b71-9ec0-b8fc10fe56fd

The social card, on its own link:
https://claude.ai/code/artifact/21f7ae04-53f4-46b7-aa58-1dd2a2b3d84a

The card is portrait, 4:5, and every size in it is set in `cqw`, so the whole
composition scales with whatever width it is rendered at. It is typeset against
a 504px timeline card, which is what Twitter actually gives an image on the
desktop feed. At that width the question lands at 23px and the smallest line at
11px. The app screen is not a good social image: at the same 504px its 13.5px
body text renders under 5px.

## Walkthrough

![Walkthrough of the goal cockpit](docs/walkthrough.gif)
