/* Alternate scenario set: the same interface, seeded from a real Codex workspace.
   Swap this in for data.js to see the prototype carrying different work.
   Nothing else changes: same styles.css, same app.js. */

/* Three statuses, and every task is in exactly one:
   you / motion / complete. Branching is an action, never a status. */
var GLYPH = { you: 'g-you', motion: 'g-motion', complete: 'g-done' };
var LABEL = { you: 'needs you', motion: 'working', complete: 'completed' };
var TIP = {
  you: 'Needs you. An agent can’t go further until you decide',
  motion: 'Working. An agent is on this without you',
  complete: 'Completed. Something is ready to use'
};
var BRANCH_TIP = 'Add work here. It keeps everything worked out so far and carries on from here';

var AGENTS = {
  'Slide Agent':  { mark: 'SL', motif: 'rosette' },
  'Chart Agent':  { mark: 'CH', motif: 'leaf' },
  'Image Agent':  { mark: 'IM', motif: 'star' },
  'Print Agent':  { mark: 'PR', motif: 'lattice' },
  'Config Agent': { mark: 'CF', motif: 'rosette' },
  'Review Agent': { mark: 'RV', motif: 'leaf' }
};

var goals = {
  deck: {
    title: 'Get the deck ready for Thursday',
    subtitle: 'Readable from the back of the room, and defensible in it.',
    agents: ['Slide Agent', 'Chart Agent'],
    branchDefault: 'Draft the answers to the three hardest questions',
    tasks: [
      { id: 'd1', state: 'you', stage: 'decide', title: 'Choose what slide one says', note: 'The finding and the method both work as an opener.', agent: 'Slide Agent', progress: 0, since: '7m',
        holds: 'Rebuild the opening three slides', basis: 'd5', basisLabel: 'the readability audit',
        options: [
          { label: 'Open with the finding', consequence: 'People leave remembering the number. Method moves to an appendix.', recommended: true },
          { label: 'Open with the method', consequence: 'Earns the two skeptics early, and spends your first two minutes doing it.' }
        ] },
      { id: 'd2', state: 'you', stage: 'decide', title: 'Decide how dense the charts get', note: 'Three combined charts, or six that each say one thing.', agent: 'Chart Agent', progress: 0, since: '35m',
        holds: 'Redraw the charts',
        options: [
          { label: 'One claim per chart', consequence: 'Six slides instead of three, and nobody in the back row squints.', recommended: true },
          { label: 'Keep them combined', consequence: 'A tighter deck that only the front two rows can actually read.' }
        ] },
      { id: 'd3', state: 'motion', stage: 'build', title: 'Rebuild the opening three slides', note: 'Both openers drafted, waiting to know which one leads.', agent: 'Slide Agent', progress: 35, since: '4m', eta: 'about 35m left',
        why: 'The first ninety seconds decide how the rest is heard.' },
      { id: 'd4', state: 'motion', stage: 'build', title: 'Redraw the charts', note: 'Rebuilding at 24pt minimum with the axes labelled in full.', agent: 'Chart Agent', progress: 58, since: '12m', eta: 'about 25m left',
        why: 'Every chart in the current deck fails at the back of the room.' },
      { id: 'd6', state: 'motion', stage: 'learn', title: 'Check each slide from the back row', note: 'Rendering at 4m viewing distance and flagging what disappears.', agent: 'Slide Agent', progress: null, since: '2m', eta: 'ongoing',
        why: 'It catches the problem the room will catch, before the room does.' },
      { id: 'd5', state: 'complete', stage: 'learn', title: 'Readability audit', note: 'Eleven of nineteen slides fail at four metres.', agent: 'Chart Agent', progress: 100, since: '1h', proof: 'Readability audit',
        why: 'It turned a vague worry into a list of eleven specific slides.' }
    ],
    artifacts: {
      'Readability audit': {
        result: 'Eleven of nineteen slides fail at four metres. Nine fail on chart labels alone, and the other two on body text under 18pt.',
        reasoning: 'Testing at viewing distance rather than by font size found problems that looked fine in the editor. The worst offenders were charts that were legible as images but not as data.',
        sources: ['19 slides rendered at 4m', 'Room dimensions from the calendar invite', 'Projector resolution and contrast spec']
      }
    },
    threads: {
      'Slide Agent': [['Slide Agent', '7m ago', 'Both openers are drafted. The finding version is 40 seconds shorter and lands the number first.'], ['Slide Agent', 'now', 'Rendering each slide at four metres as it changes, so nothing regresses while we fix the rest.']],
      'Chart Agent': [['Chart Agent', '1h ago', 'Eleven of nineteen fail at four metres. Nine of those are chart labels, not body text.'], ['Chart Agent', 'now', 'Redrawing at 24pt minimum. Splitting the combined charts would fix six of them outright.']]
    }
  },
  lavender: {
    title: 'Finish the lavender series',
    subtitle: 'Six pieces that hang together and survive being printed.',
    agents: ['Image Agent', 'Print Agent'],
    branchDefault: 'Try one piece at dusk',
    tasks: [
      { id: 'v1', state: 'you', stage: 'decide', title: 'Pick the palette the set commits to', note: 'The studies drifted warm. The garden ones did not.', agent: 'Image Agent', progress: 0, since: '18m',
        holds: 'Render the remaining four', basis: 'v4', basisLabel: 'the proof prints',
        options: [
          { label: 'Cooler, as the garden reads', consequence: 'Holds together as a set, and the lavender survives printing.', recommended: true },
          { label: 'Warmer, as the studies read', consequence: 'Closer to the originals, and the lavender goes muddy on paper.' }
        ] },
      { id: 'v2', state: 'motion', stage: 'build', title: 'Render the remaining four', note: 'Two done at both palettes so the choice is reversible.', agent: 'Image Agent', progress: 45, since: '6m', eta: 'about 50m left',
        why: 'Six is the smallest set that reads as a series rather than as attempts.' },
      { id: 'v3', state: 'motion', stage: 'learn', title: 'Test how lavender prints', note: 'Same swatch on three papers, checking where the purple collapses.', agent: 'Print Agent', progress: 30, since: '20m', eta: 'about 40m left',
        why: 'Lavender is the one colour that will not survive a bad paper choice.' },
      { id: 'v4', state: 'complete', stage: 'learn', title: 'Proof prints', note: 'Two pieces, three papers, warm and cool side by side.', agent: 'Print Agent', progress: 100, since: '2h', proof: 'Proof prints',
        why: 'Seeing them on paper is the only way this decision can be made honestly.' }
    ],
    artifacts: {
      'Proof prints': {
        result: 'On matte, the warm palette loses the lavender entirely and reads brown. The cool palette holds on all three papers.',
        reasoning: 'The warm version looked better on screen, which is exactly why it needed proofing. Screen backlighting was carrying a purple the paper cannot.',
        sources: ['2 pieces printed on 3 papers', 'Warm and cool palettes side by side', 'Original garden reference photos']
      }
    },
    threads: {
      'Image Agent': [['Image Agent', '18m ago', 'Rendering two of the four at both palettes, so whichever you pick nothing is wasted.'], ['Image Agent', 'now', 'The cool palette is more consistent across the set. The warm one drifts piece to piece.']],
      'Print Agent': [['Print Agent', '2h ago', 'Warm goes brown on matte. Cool holds on all three papers, including the cheap one.'], ['Print Agent', 'now', 'Running the same swatch on the last paper to see where the purple gives out.']]
    }
  },
  standards: {
    title: 'Make every project follow the same rules',
    subtitle: 'One set of standards, not three copies quietly drifting apart.',
    agents: ['Config Agent', 'Review Agent'],
    branchDefault: 'Add a rule about commit messages',
    tasks: [
      { id: 's1', state: 'you', stage: 'decide', title: 'Decide where the rules live', note: 'They exist three times already and have started disagreeing.', agent: 'Config Agent', progress: 0, since: '22m',
        holds: 'Move the writing rules to one place', basis: 's5', basisLabel: 'the drift report',
        options: [
          { label: 'One global set', consequence: 'Every project inherits. Overriding one takes a deliberate step.', recommended: true },
          { label: 'Per project, copied', consequence: 'Easier to bend locally, and they drift apart again within a month.' }
        ] },
      { id: 's2', state: 'motion', stage: 'build', title: 'Move the writing rules to one place', note: 'Reconciling the three versions into one before moving it.', agent: 'Config Agent', progress: 40, since: '9m', eta: 'about 30m left',
        why: 'Three copies means the rule you get depends on which folder you opened.' },
      { id: 's3', state: 'motion', stage: 'build', title: 'Install the engineering plugin everywhere', note: 'Eleven of thirty-four repos still without it.', agent: 'Config Agent', progress: 68, since: '15m', eta: 'about 20m left',
        why: 'A standard that only some projects have is not a standard.' },
      { id: 's4', state: 'motion', stage: 'learn', title: 'Watch what the rules actually catch', note: 'Logging every time a rule fires and whether it was right.', agent: 'Review Agent', progress: null, since: '4m', eta: 'ongoing',
        why: 'A rule that never fires is clutter; one that fires wrongly is worse.' },
      { id: 's5', state: 'complete', stage: 'learn', title: 'Drift report', note: 'The three copies now disagree in seven places.', agent: 'Review Agent', progress: 100, since: '3h', proof: 'Drift report',
        why: 'It showed the copies had stopped being copies months ago.' }
    ],
    artifacts: {
      'Drift report': {
        result: 'Seven disagreements across three copies. Four are harmless wording, three change what actually gets flagged, and one contradicts the other two outright.',
        reasoning: 'Comparing them line by line rather than file by file found the contradictions. Two of the copies were edited on the same day in opposite directions.',
        sources: ['3 config copies, line-by-line diff', 'Edit history for each', '34 repos under Contributions']
      }
    },
    threads: {
      'Config Agent': [['Config Agent', '22m ago', 'Three copies, seven disagreements. One of them contradicts the other two, so something has been silently wrong.'], ['Config Agent', 'now', 'Reconciling into a single set. Where they conflict I am keeping the strictest version and noting it.']],
      'Review Agent': [['Review Agent', '3h ago', 'The copies stopped matching months ago. Two were edited the same day in opposite directions.'], ['Review Agent', 'now', 'Logging every rule that fires and whether it was right, so the useless ones can be dropped.']]
    }
  }
};
Object.keys(goals).forEach(function (k) { goals[k].branches = []; goals[k].rated = {}; });
