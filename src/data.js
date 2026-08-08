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
  'Ops Agent':       { mark: 'OA', hue: '#101014' },
  'Release Agent':   { mark: 'RA', hue: '#3f3f49' },
  'Support Triage':  { mark: 'ST', hue: '#26262d' },
  'Content Agent':   { mark: 'CA', hue: '#0a8f57' },
  'Site Builder':    { mark: 'SB', hue: '#5c5c68' }
};

var goals = {
  support: {
    title: 'Clear the support backlog before launch',
    subtitle: 'Get the queue down and the week covered before v2 ships.',
    agents: ['Ops Agent', 'Support Triage'],
    branchDefault: 'Draft a status page template',
    tasks: [
      { id: 's1', state: 'you', stage: 'decide', title: 'Decide the refund line', note: '14 accounts were double-charged during the migration test.', agent: 'Ops Agent', progress: 0, since: '6m',
        holds: 'Reply to the 14 affected accounts', basis: 's4', basisLabel: 'the billing audit',
        options: [
          { label: 'Refund all 14 automatically', consequence: 'Costs $420 and closes it today. Nobody has to ask.', recommended: true },
          { label: 'Refund on request', consequence: 'Cheaper, but each request becomes a ticket in launch week.' }
        ] },
      { id: 's2', state: 'you', stage: 'decide', title: 'Approve auto-closing 63 stale tickets', note: '63 tickets have had no reply from the customer in 30 days.', agent: 'Support Triage', progress: 0, since: '40m',
        holds: 'Triage the 240 open tickets',
        options: [
          { label: 'Close them with a message', consequence: 'Clears a quarter of the queue today. Anyone still stuck can reply and reopen.', recommended: true },
          { label: 'Leave them open', consequence: 'Nobody gets closed on, but the queue stays above 200 into launch week.' }
        ] },
      { id: 's3', state: 'motion', stage: 'learn', title: 'Triage the 240 open tickets', note: 'Grouping by cause, oldest first.', agent: 'Support Triage', progress: 68, since: '4m', eta: 'about 40m left',
        why: 'Half the queue looks like a single bug.' },
      { id: 's5', state: 'motion', stage: 'build', title: 'Reply to the 14 affected accounts', note: 'Drafting one message per billing case.', agent: 'Ops Agent', progress: 22, since: '11m', eta: 'about 1h left',
        why: 'These are the only people actually owed money.' },
      { id: 's6', state: 'motion', stage: 'build', title: 'Update the help centre for v2', note: 'Rewriting the six most-read articles.', agent: 'Ops Agent', progress: 45, since: '25m', eta: 'about 2h left',
        why: 'Most tickets start with someone failing to find the answer.' },
      { id: 's4', state: 'complete', stage: 'learn', title: 'Billing audit', note: 'Checked every charge since the migration test.', agent: 'Ops Agent', progress: 100, since: '3h', proof: 'Billing audit',
        why: 'It found the double charges before a customer did.' }
    ],
    artifacts: {
      'Billing audit': {
        result: '14 accounts charged twice between 02:10 and 02:40 during the test migration. $420 in total. No other anomalies across 1,200 accounts.',
        reasoning: 'The test run wrote to the live billing table for thirty minutes before it was caught. Every charge in that window was re-checked by hand rather than by query.',
        sources: ['Billing table, 1,200 accounts', 'Migration test log, 02:00 to 03:00', 'Card processor export, December']
      }
    },
    threads: {
      'Ops Agent': [['Ops Agent', '3h ago', 'Billing audit done. 14 accounts double-charged, $420 total, all inside one thirty minute window.'], ['Ops Agent', 'now', 'Drafting the replies. The wording changes depending on whether we refund everyone or wait to be asked.']],
      'Support Triage': [['Support Triage', '4m ago', '240 tickets open. 112 mention the editor scroll bug, so half the queue is one fix.'], ['Support Triage', 'now', '63 of them have had no customer reply in 30 days. I can close those with a message, but not without your say-so.']]
    }
  },
  launch: {
    title: 'Ship the v2 launch',
    subtitle: 'Get v2 out with paid plans, without losing the free accounts.',
    agents: ['Release Agent', 'Support Triage'],
    branchDefault: 'Plan a rollback if signups dip',
    tasks: [
      { id: 'l1', state: 'you', stage: 'decide', title: 'Decide what ships on day one', note: 'Two features are ready. The third needs another week.', agent: 'Release Agent', progress: 0, since: '8m',
        holds: 'Write the launch notes', basis: 'l6', basisLabel: 'the migration dry run',
        options: [
          { label: 'Ship the two that are ready', consequence: 'Launch Tuesday, so outreach can start the same week.', recommended: true },
          { label: 'Wait and ship all three', consequence: 'Launch slips a week. The first paying customers slip with it.' }
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
