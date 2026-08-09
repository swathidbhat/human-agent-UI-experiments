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
  'Research Agent': { mark: 'RA', hue: '#101014' },
  'Draft Agent':    { mark: 'DA', hue: '#26262d' },
  'File Agent':     { mark: 'FA', hue: '#0a8f57' },
  'Repo Agent':     { mark: 'RP', hue: '#5c5c68' },
  'Build Agent':    { mark: 'BA', hue: '#101014' },
  'Playtest Agent': { mark: 'PA', hue: '#0a8f57' }
};

var goals = {
  article: {
    title: 'Publish the agent interfaces piece',
    subtitle: 'Turn four interviews and a pile of notes into something worth reading.',
    agents: ['Research Agent', 'Draft Agent'],
    branchDefault: 'Pull quotes for the social post',
    tasks: [
      { id: 'a1', state: 'you', stage: 'decide', title: 'Choose what the piece argues', note: 'The interviews support two different pieces.', agent: 'Draft Agent', progress: 0, since: '6m',
        holds: 'Rewrite the opening', basis: 'a5', basisLabel: 'the interview storybank',
        options: [
          { label: 'Agents need a stable object', consequence: 'Reads as a design argument. Every interview already backs it.', recommended: true },
          { label: 'Chat was the wrong default', consequence: 'Sharper and more contrarian, but only two interviews support it.' }
        ] },
      { id: 'a2', state: 'you', stage: 'decide', title: 'Pick who gets quoted', note: 'Two of the four asked to be anonymous.', agent: 'Research Agent', progress: 0, since: '40m',
        options: [
          { label: 'Name the two who agreed', consequence: 'Specific and checkable. The other two become paraphrase.', recommended: true },
          { label: 'Anonymise all four', consequence: 'Consistent, but the piece loses its named sources.' }
        ] },
      { id: 'a3', state: 'motion', stage: 'build', title: 'Rewrite the opening', note: 'Holding at the second paragraph until the argument is settled.', agent: 'Draft Agent', progress: 30, since: '4m', eta: 'about 40m left',
        why: 'The first two paragraphs decide whether anyone reads the rest.' },
      { id: 'a4', state: 'motion', stage: 'build', title: 'Fix the heading hierarchy', note: 'Three sections are nested one level too deep.', agent: 'Draft Agent', progress: 62, since: '18m', eta: 'about 15m left',
        why: 'The piece is long enough that the headings are the navigation.' },
      { id: 'a5', state: 'motion', stage: 'learn', title: 'Sort the interview storybank', note: 'Tagging 41 excerpts by the claim they support.', agent: 'Research Agent', progress: 74, since: '11m', eta: 'about 20m left',
        why: 'It shows which argument the interviews can actually carry.' },
      { id: 'a6', state: 'complete', stage: 'learn', title: 'Question categories for agent PMs', note: 'Six categories, each with the interviews behind it.', agent: 'Research Agent', progress: 100, since: '2h', proof: 'Question categories for agent PMs',
        why: 'It gave the interviews a shape before the writing started.' }
    ],
    artifacts: {
      'Question categories for agent PMs': {
        result: 'Six categories: stable objects, delegation boundaries, proof of work, interruption cost, recovery from wrong turns, and what the person is still responsible for.',
        reasoning: 'Grouping by what the PM was worried about, rather than by product area, put four interviews that sounded unrelated into the same category.',
        sources: ['4 practitioner interviews, transcribed', '41 tagged excerpts', 'Design of Everyday Things, chapters 1 and 7']
      }
    },
    threads: {
      'Research Agent': [['Research Agent', '2h ago', 'Six categories hold across all four interviews. Stable objects is the only one every person raised unprompted.'], ['Research Agent', 'now', 'Tagging the storybank against those categories. 41 excerpts, about three quarters done.']],
      'Draft Agent': [['Research Agent', '18m ago', 'Heading levels are inconsistent from section four onward. Fixing as I go.'], ['Draft Agent', 'now', 'Opening is drafted twice, once per argument. I can drop either in once you choose.']]
    }
  },
  workspace: {
    title: 'Get Documents under control',
    subtitle: 'Four years of files, screenshots and half-finished repos.',
    agents: ['File Agent', 'Repo Agent'],
    branchDefault: 'Archive anything untouched for a year',
    tasks: [
      { id: 'w1', state: 'you', stage: 'decide', title: 'Decide how screenshots get filed', note: '1,900 of them, and the two schemes disagree.', agent: 'File Agent', progress: 0, since: '25m',
        holds: 'Classify the desktop screenshots', basis: 'w5', basisLabel: 'the folder review',
        options: [
          { label: 'By project', consequence: 'Matches how you look for them. Roughly 300 will not fit anywhere.', recommended: true },
          { label: 'By month', consequence: 'Every file lands somewhere, but finding one means remembering when.' }
        ] },
      { id: 'w2', state: 'motion', stage: 'build', title: 'Classify the desktop screenshots', note: 'Reading each one and proposing a folder.', agent: 'File Agent', progress: 48, since: '7m', eta: 'about 1h left',
        why: 'The desktop is where everything lands and nothing leaves.' },
      { id: 'w3', state: 'motion', stage: 'learn', title: 'Count the repos under Contributions', note: 'Walking the folder and checking each for a remote.', agent: 'Repo Agent', progress: null, since: '2m', eta: 'ongoing',
        why: 'You cannot tidy what you have not counted.' },
      { id: 'w4', state: 'motion', stage: 'build', title: 'Add the no-slop rule globally', note: 'Moving it from three project configs into one place.', agent: 'Repo Agent', progress: 35, since: '30m', eta: 'about 25m left',
        why: 'It is already written three times and drifts every time it is copied.' },
      { id: 'w5', state: 'complete', stage: 'learn', title: 'Folder review', note: 'Mapped what is where and what has not been opened in a year.', agent: 'File Agent', progress: 100, since: '3h', proof: 'Folder review',
        why: 'It found the four folders holding most of the mess.' }
    ],
    artifacts: {
      'Folder review': {
        result: 'Nine top-level folders. Four hold 80% of the files. Two have not been opened in over a year and can be archived whole.',
        reasoning: 'Sorting by last-opened rather than by size found the dead weight fast. The big folders turned out to be the active ones.',
        sources: ['Documents tree, 9 folders and 12,400 files', 'Last-opened timestamps', 'Contributions folder, 34 repos']
      }
    },
    threads: {
      'File Agent': [['File Agent', '3h ago', 'Four folders hold most of it. Two more have not been opened since last year and can go whole.'], ['File Agent', 'now', 'Classifying screenshots. About 300 do not belong to any project, which is what the filing decision is really about.']],
      'Repo Agent': [['Repo Agent', '30m ago', 'The no-slop rule exists in three configs and they have already drifted apart.'], ['Repo Agent', 'now', 'Counting repos under Contributions. 34 folders so far, 11 with no remote.']]
    }
  },
  game: {
    title: 'Make trashketball playable',
    subtitle: 'Get the build good enough to hand to someone else.',
    agents: ['Build Agent', 'Playtest Agent'],
    branchDefault: 'Try a two-player mode',
    tasks: [
      { id: 'g1', state: 'you', stage: 'decide', title: 'Choose how a throw is aimed', note: 'Both feel fine to you. They do not feel the same to a first-timer.', agent: 'Build Agent', progress: 0, since: '14m',
        holds: 'Tune the throw physics', basis: 'g4', basisLabel: 'the playtest notes',
        options: [
          { label: 'Drag back and release', consequence: 'Everyone got it without being told. Harder to be precise with.', recommended: true },
          { label: 'Tap to set power, tap to throw', consequence: 'More control once learned, but three of five testers missed the second tap.' }
        ] },
      { id: 'g2', state: 'motion', stage: 'build', title: 'Tune the throw physics', note: 'Arc is right, bounce off the rim is still wrong.', agent: 'Build Agent', progress: 55, since: '5m', eta: 'about 30m left',
        why: 'The rim bounce is the moment people either laugh or quit.' },
      { id: 'g3', state: 'motion', stage: 'build', title: 'Light the court', note: 'One key light, and a shadow that lands under the ball.', agent: 'Build Agent', progress: 20, since: '22m', eta: 'about 1h left',
        why: 'Without a shadow nobody can tell how far away the bin is.' },
      { id: 'g4', state: 'motion', stage: 'learn', title: 'Collect playtest notes', note: 'Five people so far, watching where they hesitate.', agent: 'Playtest Agent', progress: null, since: '9m', eta: 'ongoing',
        why: 'It tells you which controls need explaining, which means they need changing.' },
      { id: 'g5', state: 'complete', stage: 'learn', title: 'Court and bin blockout', note: 'Proportions settled at 3:2, bin at regulation height.', agent: 'Build Agent', progress: 100, since: '1h', proof: 'Court and bin blockout',
        why: 'Everything else is tuned against these proportions.' }
    ],
    artifacts: {
      'Court and bin blockout': {
        result: 'Court 3:2, bin at 1.05m, throw line at 4m. Every later measurement is relative to these three.',
        reasoning: 'Regulation height felt too easy at desk scale, so the throw line moved back rather than the bin going up. Moving the bin broke the shadow read.',
        sources: ['Five blockout passes', 'Regulation bin dimensions', 'Playtest session 1, three players']
      }
    },
    threads: {
      'Build Agent': [['Build Agent', '1h ago', 'Blockout is settled. Court 3:2, bin at regulation height, throw line at 4m.'], ['Build Agent', 'now', 'Arc feels right. The rim bounce still sends the ball straight up, which nobody expects.']],
      'Playtest Agent': [['Playtest Agent', '9m ago', 'Five testers. Everyone understood drag-and-release without being told. Three missed the second tap on the other scheme.'], ['Playtest Agent', 'now', 'Watching where people hesitate rather than whether they score. Hesitation is the signal.']]
    }
  }
};
Object.keys(goals).forEach(function (k) { goals[k].branches = []; goals[k].rated = {}; });
