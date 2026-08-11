/* Vocabulary, agents, and the seeded goals. Loaded before app.js. */

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
  'Tester':          { mark: 'TE', motif: 'rosette' },
  'Analyzer':        { mark: 'AN', motif: 'leaf' },
  'Website Updater': { mark: 'WU', motif: 'octagram' },
  'Content Agent':   { mark: 'CA', motif: 'star' },
  'Site Builder':    { mark: 'SB', motif: 'lattice' }
};

var goals = {
  swish: {
    title: 'Keep the swish game study current',
    agents: ['Tester', 'Analyzer', 'Website Updater'],
    branchDefault: 'Chart score against cost per run',
    tasks: [
      { id: 's1', state: 'you', stage: 'decide', title: 'Choose what the table leads with', note: 'The ranking answers one question or the other.', agent: 'Website Updater', progress: 0, since: '8m',
        holds: 'Rebuild the results table', basis: 's6', basisLabel: 'the July numbers',
        options: [
          { label: 'Rank by score', consequence: 'Answers who plays best. The order barely moves between runs.', recommended: true },
          { label: 'Rank by cost per point', consequence: 'Answers who plays best for the money. Cheaper models climb, and the order shifts whenever prices do.' }
        ] },
      { id: 's2', state: 'you', stage: 'decide', title: 'Decide what to do about the build with no logs', note: 'Its transcript aged out before it was saved.', agent: 'Analyzer', progress: 0, since: '30m',
        holds: 'Rebuild the results table',
        options: [
          { label: 'Drop the row until it can be rerun', consequence: 'Every figure on the site traces back to a saved log. One missing row costs less than one number nobody can check.', recommended: true },
          { label: 'Publish it, marked unverifiable', consequence: 'Keeps the build in the table, and now some rows can be checked and some cannot.' }
        ] },
      { id: 's3', state: 'you', stage: 'decide', title: 'Choose how many runs per model', note: 'More runs steady the score. Each one costs money and time.', agent: 'Tester', progress: 0, since: '52m',
        options: [
          { label: 'Three runs each', consequence: 'Steadies the score enough to trust a small gap between two models. Triples the bill.', recommended: true },
          { label: 'One run each', consequence: 'Cheap and quick, and one lucky run can put a model two places too high.' }
        ] },
      { id: 's4', state: 'motion', stage: 'learn', title: 'Save the logs before they expire', note: 'Copying the runs for the four new builds.', agent: 'Tester', progress: 66, since: '3m', eta: 'about 15m left',
        why: 'Transcripts get purged, and two builds already lost their figures that way.' },
      { id: 's5', state: 'motion', stage: 'build', title: 'Rebuild the results table', note: 'Redoing the scores, the cost breakdown and the row counts.', agent: 'Analyzer', progress: 30, since: '9m', eta: 'about 1h left',
        why: 'The table cannot be finished until you have said what it leads with.' },
      { id: 's7', state: 'motion', stage: 'build', title: 'Refresh the charts on the site', note: 'Rebuilding them as each score lands.', agent: 'Website Updater', progress: null, since: '1m', eta: 'runs after every build',
        why: 'It keeps the published charts matching the table they came from.' },
      { id: 's6', state: 'complete', stage: 'learn', title: 'Check the July builds for contamination', note: 'Twelve builds checked. None could see another.', agent: 'Analyzer', progress: 100, since: '45m', proof: 'July contamination check',
        why: 'A build that can see another build is measuring the copy, not the model.' }
    ],
    artifacts: {
      'July contamination check': {
        result: 'Twelve builds, none of them able to see another one\u2019s work. Two runs overlapped in time but not in workspace, so both numbers stand.',
        reasoning: 'Overlap on the clock is fine. Overlap in the workspace is not, because a build that can read another build is measuring how well it copies. Only the second kind was worth failing a run over.',
        sources: ['Saved run logs for all twelve builds', 'The timing window, prompt to delivery, used for every build', 'scripts/measure.py, so each number can be rerun']
      }
    },
    threads: {
      'Tester': [['Tester', '45m ago', 'Four new builds finished. Logs are still on disk, so I am copying them now rather than after the scoring.'], ['Tester', 'now', 'One run per model right now. Two models are within a point of each other, which is inside what a single run can swing.']],
      'Analyzer': [['Analyzer', '45m ago', 'Contamination check is clean across all twelve. Two overlapped in time, neither could read the other.'], ['Analyzer', 'now', 'One build has no saved log. I can compute its number but nobody could ever check it.']],
      'Website Updater': [['Website Updater', '20m ago', 'Charts are rebuilt through the July builds.'], ['Website Updater', 'now', 'The table sorts by score today. Sorting by cost per point moves four models and changes who reads as the winner.']]
    }
  },
  website: {
    title: 'Keep website updated',
    agents: ['Content Agent', 'Site Builder'],
    branchDefault: 'Add a customer logo wall',
    tasks: [
      { id: 'w1', state: 'you', stage: 'decide', title: 'Approve the Customer Y quote', note: 'Customer Y signed off on two versions.', agent: 'Content Agent', progress: 0, since: '12m',
        holds: 'Add the Customer Y case study',
        options: [
          { label: 'The version with the number', consequence: '“Onboarding went from six weeks to four days.” Stronger, needs their legal sign-off.', recommended: true },
          { label: 'The softer version', consequence: '“Onboarding is dramatically faster.” Ships today, harder to believe.' }
        ] },
      { id: 'w2', state: 'motion', stage: 'build', title: 'Add the Customer Y case study', note: 'Writing it from the pilot interview.', agent: 'Content Agent', progress: 55, since: '8m', eta: 'about 30m left',
        why: 'The quote you approve becomes the headline of the study.' },
      { id: 'w3', state: 'motion', stage: 'build', title: 'Refresh the homepage', note: 'Rebuilding the hero and feature blocks.', agent: 'Site Builder', progress: 40, since: '3m', eta: 'about 45m left',
        why: 'The page has to describe v2 on launch morning.' },
      { id: 'w4', state: 'motion', stage: 'learn', title: 'Add the board of advisors to Team', note: 'Chasing four bios and headshots.', agent: 'Content Agent', progress: 25, since: '30m', eta: 'waiting on people',
        why: 'The Team page is the first one most investors open.' },
      { id: 'w5', state: 'complete', stage: 'learn', title: 'Homepage copy rewrite', note: 'New hero line and subhead are live.', agent: 'Content Agent', progress: 100, since: '1h', proof: 'Homepage copy rewrite',
        why: 'It fixed the page most visitors never read past.' }
    ],
    artifacts: {
      'Homepage copy rewrite': {
        result: 'Ship agent work you can actually check. Every result arrives with the reasoning and the sources behind it.',
        reasoning: 'The old hero described the category, not the product. Three of five test readers could not say what it did.',
        sources: ['5 unmoderated reader tests', 'Search terms people arrive on', 'The old page, 11 sections']
      }
    },
    threads: {
      'Content Agent': [['Content Agent', '12m ago', 'The pilot interview is 40 minutes. The strongest line is the onboarding number, but that version needs Customer Y legal sign-off.'], ['Content Agent', 'now', 'Case study is drafted around a placeholder quote. Swapping in whichever version you approve takes a minute.']],
      'Site Builder': [['Site Builder', '3m ago', 'Hero and feature blocks rebuilt around v2. The old page had 11 sections, this one has 6.'], ['Site Builder', 'now', 'Team page needs the advisor row before I can finish the layout.']]
    }
  }
};
Object.keys(goals).forEach(function (k) { goals[k].branches = []; goals[k].rated = {}; });
