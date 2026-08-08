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
var BRANCH_TIP = 'Add follow-up work. It keeps everything worked out so far and carries on from here';

var AGENTS = {
  'Release Agent':   { mark: 'RA', hue: '#101014' },
  'Support Triage':  { mark: 'ST', hue: '#26262d' },
  'Content Agent':   { mark: 'CA', hue: '#0a8f57' },
  'Site Builder':    { mark: 'SB', hue: '#5c5c68' }
};

var goals = {
  launch: {
    title: 'Ship the v2 launch',
    subtitle: 'Get v2 out with paid plans, without losing the free accounts.',
    agents: ['Release Agent', 'Support Triage'],
    branchDefault: 'Plan a rollback if signups dip',
    tasks: [
      { id: 'l1', state: 'you', stage: 'decide', title: 'Decide what ships on day one', note: 'Two features are ready. The third needs another week.', agent: 'Release Agent', progress: 0, since: '8m',
        holds: 'Write the launch notes', basis: 'l6', basisLabel: 'the migration dry run',
        options: [
          { label: 'Ship the two that are ready', consequence: 'Launch Tuesday, the same morning the refreshed site goes live.', recommended: true },
          { label: 'Wait and ship all three', consequence: 'Launch slips a week, and the site refresh sits finished but unused.' }
        ] },
      { id: 'l2', state: 'you', stage: 'decide', title: 'Set the rollback trigger', note: 'How far signups can fall before v2 is pulled.', agent: 'Release Agent', progress: 0, since: '30m',
        holds: 'Watch for breakage reports',
        options: [
          { label: 'Below 60% of normal for a day', consequence: 'Catches a real problem without panicking on a quiet Tuesday.', recommended: true },
          { label: 'Only if the migration fails', consequence: 'Fewer false alarms, but a slow bleed goes unnoticed.' }
        ] },
      { id: 'l3', state: 'you', stage: 'decide', title: 'Choose when to email the 1,200', note: 'The announcement lands once. Timing is the whole thing.', agent: 'Support Triage', progress: 0, since: '52m',
        holds: 'Write the launch notes',
        options: [
          { label: 'The morning it ships', consequence: 'One message, one moment. Support spikes for a day.', recommended: true },
          { label: 'A day early, as a heads-up', consequence: 'Softer landing, but the news breaks before the product does.' }
        ] },
      { id: 'l4', state: 'motion', stage: 'build', title: 'Move the 1,200 free accounts over', note: 'Moving them to the new free tier.', agent: 'Release Agent', progress: 66, since: '3m', eta: 'about 15m left',
        why: 'Nobody can be locked out on launch morning.' },
      { id: 'l5', state: 'motion', stage: 'build', title: 'Write the launch notes', note: 'Drafting the changelog and the email.', agent: 'Release Agent', progress: 30, since: '9m', eta: 'about 1h left',
        why: 'The notes cannot be finished until you know what ships.' },
      { id: 'l7', state: 'motion', stage: 'learn', title: 'Watch for breakage reports', note: 'Grouping beta tickets by feature.', agent: 'Support Triage', progress: 12, since: '1m', eta: 'runs until launch',
        why: 'It tells you fast if the migration broke something real.' },
      { id: 'l6', state: 'complete', stage: 'learn', title: 'Migration dry run', note: 'Ran against a copy. Two failures, both fixed.', agent: 'Release Agent', progress: 100, since: '45m', proof: 'Migration dry run',
        why: 'It found the accounts that would have broken on launch day.' }
    ],
    artifacts: {
      'Migration dry run': {
        result: '1,200 accounts moved in four minutes. Two failures, both on accounts created before the plans existed. Both now handled.',
        reasoning: 'Nobody is paying yet, so a broken migration costs trust rather than revenue. Right now trust is the more expensive thing to lose.',
        sources: ['Production snapshot, taken 06:12', 'Account table, 1,200 rows', 'Billing schema history since 2023']
      }
    },
    threads: {
      'Release Agent': [['Release Agent', '45m ago', 'Dry run done. 1,200 accounts in four minutes, two failures, both created before plans existed. Fixed.'], ['Release Agent', 'now', 'Launch notes are half written. The opening paragraph changes depending on whether the third feature ships.']],
      'Support Triage': [['Support Triage', '52m ago', 'Nine beta tickets so far. Seven mention the new editor, all the same scrolling bug.'], ['Support Triage', 'now', 'Grouping by feature so you see breakage by area instead of ticket by ticket.']]
    }
  },
  website: {
    title: 'Keep website updated',
    subtitle: 'Get the site ready for the v2 launch.',
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
