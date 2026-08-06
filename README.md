# Human–agent UI experiments

Prototypes for a goal-first agent workspace. Open any file in a browser; each is
self-contained, no build step and no network calls.

## Files

| File | What it is |
|---|---|
| `goal-cockpit.html` | The working prototype. Overview, Flow and per-agent chat. |
| `directions-split-and-map.html` | Three ways to make "your move" prominent, plus ten map layouts. |
| `directions-ten-aesthetics.html` | Ten visual treatments of the same task queue. |
| `concept-summary.md` | The original model this was built from. |

## The model

Every task is in exactly one of three states, and there is no fourth:

- **Your move** — a decision or action is needed from you.
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
- Flow is derived from the tasks themselves, so the two views cannot disagree.
  Connectors are drawn only where a real dependency exists.

## Design constraints it was built under

- Three states, mutually exclusive and collectively exhaustive.
- Plain language throughout: no branch, node, route, artifact, or proof-of-work.
- No box carries a fill and a border of different colours.
- No neutral greys. Secondary text is tinted plum; states are raspberry
  (needs you), emerald (working), and near-black (completed).
- Rules only where they separate something. Space does the rest.
- Type is one family, Avenir Next, with weight and size carrying the hierarchy.

## Published

The cockpit is also live as a private artifact:
https://claude.ai/code/artifact/e4ad5d13-446d-4b71-9ec0-b8fc10fe56fd
