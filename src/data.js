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
      { id: 's1', state: 'you', stage: 'decide', title: 'Decide how games should be ranked', note: 'The two orders name different winners.', agent: 'Website Updater', progress: 0, since: '8m',
        holds: 'Publish the new rankings', basis: 's6', basisLabel: 'the July numbers',
        options: [
          { label: 'Rank by score', consequence: 'The best scores win, and the order rarely changes.', recommended: true },
          { label: 'Rank by cost per point', consequence: 'Cheap models rise, and the order changes whenever prices do.' }
        ] },
      { id: 's2', state: 'you', stage: 'decide', title: 'Decide whether the run with no log counts', note: 'Its log expired before we copied it.', agent: 'Analyzer', progress: 0, since: '30m',
        holds: 'Publish the new rankings',
        options: [
          { label: 'Leave it out until it can be rerun', consequence: 'One missing model costs less than one number nobody can check.', recommended: true },
          { label: 'Publish it, flagged as unverified', consequence: 'Keeps the model in, but now some numbers can be checked and some cannot.' }
        ] },
      { id: 's3', state: 'you', stage: 'decide', title: 'Choose how many runs per model', note: 'More runs steady the score. Each one costs money.', agent: 'Tester', progress: 0, since: '52m',
        options: [
          { label: 'Three runs each', consequence: 'Steady enough to trust a small gap, and it triples the bill.', recommended: true },
          { label: 'One run each', consequence: 'Cheap and quick, and one lucky run can put a model two places too high.' }
        ] },
      { id: 's4', state: 'motion', stage: 'learn', title: 'Save the logs before they expire', note: 'Copying the logs for the four newest models.', agent: 'Tester', progress: 66, since: '3m', eta: 'about 15m left',
        why: 'Logs are purged after a week. Two models already lost their numbers that way.' },
      { id: 's5', state: 'motion', stage: 'build', title: 'Publish the new rankings', note: 'Scores, cost per point, and how many runs each model got.', agent: 'Analyzer', progress: 30, since: '9m', eta: 'about 1h left',
        why: 'It cannot go out until you have said how to rank.' },
      { id: 's7', state: 'motion', stage: 'build', title: 'Refresh the charts on the site', note: 'Rebuilding each chart as its score lands.', agent: 'Website Updater', progress: null, since: '1m', eta: 'runs after every model',
        why: 'Keeps the charts matching the rankings.' },
      { id: 's6', state: 'complete', stage: 'learn', title: 'Check whether any model could see another', note: 'Twelve checked. None of them could.', agent: 'Analyzer', progress: 100, since: '45m', proof: 'July answer-sharing check',
        why: 'A model that can read another one’s answers is being scored on copying.' }
    ],
    artifacts: {
      'July answer-sharing check': {
        result: 'Twelve models, none of them able to read another one\u2019s work. Two ran at the same time but in separate workspaces, so both numbers stand.',
        reasoning: 'Running at the same time is fine. Sharing a workspace is not, because a model that can read another one\u2019s answers is being scored on copying. Only the second kind was worth failing a run over.',
        sources: ['Saved logs for all twelve models', 'Start and finish times for every run', 'scripts/measure.py, so any number can be recomputed']
      }
    },
    threads: {
      'Tester': [['Tester', '45m ago', 'Four new models finished. Their logs are still on disk, so I am copying them now rather than after scoring.'], ['Tester', 'now', 'One run per model so far. Two models are within a point of each other, which is inside what a single run can swing.']],
      'Analyzer': [['Analyzer', '45m ago', 'No model could read another. Two ran at the same time, in separate workspaces.'], ['Analyzer', 'now', 'One run has no saved log. I can still compute its number, but nobody could ever check it.']],
      'Website Updater': [['Website Updater', '20m ago', 'Charts are current through the July runs.'], ['Website Updater', 'now', 'Ranking by score today. Ranking by cost per point moves four models and changes who comes first.']]
    }
  },
  prewave: {
    title: 'Grow prewave',
    agents: ['Content Agent', 'Site Builder'],
    branchDefault: 'Add a customer logo wall',
    tasks: [
      { id: 'w1', state: 'you', stage: 'decide', title: 'Approve the Customer Y quote', note: 'Customer Y signed off on two versions.', agent: 'Content Agent', progress: 0, since: '12m',
        holds: 'Add the Customer Y case study',
        options: [
          { label: 'The version with the number', consequence: '“Onboarding went from six weeks to four days.” Stronger, but it needs their legal sign-off.', recommended: true },
          { label: 'The softer version', consequence: '“Onboarding is dramatically faster.” Ships today, but it is harder to believe.' }
        ] },
      { id: 'w2', state: 'motion', stage: 'build', title: 'Add the Customer Y case study', note: 'Writing it from the pilot interview.', agent: 'Content Agent', progress: 55, since: '8m', eta: 'about 30m left',
        why: 'The quote you pick becomes the headline of the study.' },
      { id: 'w3', state: 'motion', stage: 'build', title: 'Refresh the homepage', note: 'Rebuilding the hero and feature blocks.', agent: 'Site Builder', progress: 40, since: '3m', eta: 'about 45m left',
        why: 'It is the first thing anyone who hears about you looks at.' },
      { id: 'w4', state: 'motion', stage: 'learn', title: 'Add the advisors to the Team page', note: 'Chasing four bios and headshots.', agent: 'Content Agent', progress: 25, since: '30m', eta: 'waiting on people',
        why: 'The Team page is the first one most investors open.' },
      { id: 'w5', state: 'complete', stage: 'learn', title: 'Rewrite the homepage copy', note: 'The new hero line and subhead are live.', agent: 'Content Agent', progress: 100, since: '1h', proof: 'Homepage copy rewrite',
        why: 'Most visitors never read past this page.' }
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
