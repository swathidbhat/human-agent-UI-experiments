# Goal Workspace Redesign

## Purpose

Redesign the agent workspace around outcomes, not agents or chats. An agent is a means to advance a goal. The product should help a person see what matters now, steer work when needed, and inspect the work behind meaningful updates.

## Core Model

Each goal can contain several tasks and several agents. The work is dynamic rather than a linear handoff: research may create a decision, a decision may unblock several tasks, and new information may justify a new branch of work.

The workspace should always make the current state easy to read:

- **Your move:** a decision or action is needed from the user.
- **In motion:** an agent can continue without intervention.
- **Completed:** a task produced a concrete artifact that is ready to use.

## Agreed Design Principles

- **Goal first:** organize the workspace around active goals. Do not make an agent inbox the primary surface.
- **Control, not project-management theater:** show the next meaningful move and the reason behind it. Avoid pretending work is a fixed linear checklist.
- **The Goal Cockpit is the default view:** it holds the goal context, the live control queue, active agents, and task status.
- **The Living Goal Map is a drill-down within the cockpit:** use it to understand dependencies, branches, and why work is waiting.
- **Branching is first-class:** users can create a new route from the control pane or from a node in the map. A branch represents a discovery, risk, decision, or new deliverable.
- **Agent activity is accessible on click:** the control surface stays concise, while a click opens the relevant agent’s live working context.
- **Proof belongs to completed tasks:** only completed work exposes proof of work. Evidence is attached to the task that produced it, not collected in a detached proof column.

## Prototype Scope

The prototype demonstrates the model across three different goals:

1. Launch the field guide
2. Plan the offsite
3. Redesign agent workspace

Each goal has its own work queue, agents, completed artifact, map, and branch flow.
