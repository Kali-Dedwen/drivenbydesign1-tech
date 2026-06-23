import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { useAuthUser } from "../components/AuthGate";
import { ModuleContentRenderer } from "../components/ModuleContentRenderer";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  navy:    "#0f2545",
  navyMid: "#1a3a6b",
  navyLight:"#2a4f8f",
  gold:    "#c9a84c",
  goldLight:"#e8c96a",
  goldDim: "#8a6e2e",
  cream:   "#faf8f4",
  ink:     "#1a1a2e",
  muted:   "#6b7a99",
  border:  "rgba(201,168,76,0.2)",
  borderGray:"rgba(26,58,107,0.12)",
  success: "#2d7a4a",
  white:   "#ffffff",
};

// ─── CURRICULUM DATA, DEEP VERSION ───────────────────────────────────────────
const PLATFORMS = {
  PIVOT_OS: {
    id: "PIVOT_OS",
    name: "PIVOT OS™",
    tagline: "Individual Reinvention",
    icon: "◎",
    audience: "Veterans · Career Transitioners · Executives at Threshold",
    color: "#1a3a6b",
    accent: "#c9a84c",
    intro: "You are at a threshold moment. PIVOT OS™ is the architecture for what comes next, not the next job, the next version of yourself.",
    chatPersona: "PIVOT Sovereign Guide",
    systemPrompt: (name, module, themes) => `You are the PIVOT OS™ Sovereign Guide: the AI intelligence embedded inside the M2M~Inc. client portal.

The person you're speaking with is ${name || "a client"}, currently working through Module ${module}.

Key themes from their profile: ${themes || "career transition, identity reinvention, new chapter"}.

Your role:
- Help them work through this module with specificity to their situation
- Name what they are actually facing, not just what they said
- Ask one clarifying question at a time, never multiple
- When they're stuck: name the real thing, not the surface thing
- Never give generic life-coach responses
- Never end with "Does that help?" or "Let me know if you have questions"
- End every response with a forward push, a direction, not a period

Register: directive, warm, prophetic, earned.
Trust/Liability gate active, no outcome guarantees.
You are not a chatbot. You are the intelligence layer of their reinvention.`,
    phases: [
      {
        id: 1, name: "Clarity", subtitle: "Identity Audit",
        modules: [
          {
            id: "1.1", title: "The Identity Inventory", duration: "45 min", type: "reflection",
            content: `Most people approaching a career transition start with their resume. That's the wrong starting point. A resume is a record of performance; it documents what you did, not who you are. The Identity Inventory starts before the resume, before the job title, before the LinkedIn profile.

What we're mapping here is the pattern underneath the performance. Every role you've held, every environment you've thrived or struggled in, every project that pulled you forward or drained you, these are data points. Individually they look like biography. Together they reveal architecture.

The Inventory has three components. First: the roles that felt like you versus the roles that felt like performance. This isn't about competence; you can be excellent at something that costs you energy every day. The distinction is whether you were expressing yourself or suppressing yourself to meet the role's demands.

Second: the conditions under which you do your best work. Not the conditions you've been told you need, or the conditions that sound good in an interview. The actual, specific conditions: the team size, the ambiguity level, the autonomy structure, the pace, the type of problem. Most people can articulate their skills with precision but go completely vague when asked about their optimal operating conditions. That vagueness is costing you placement accuracy.

Third: the recurring feedback you've received across contexts. Not the performance review language, strip that away. Look for the pattern. When people describe you to others, what do they keep saying? When you're at your best, what do colleagues notice first? That recurring signal is closer to your core offering than anything on your resume.`,
            exercise: `This exercise has four parts. Work through each one fully before moving to the next.

Part 1, The Role Audit (15 min)
List every significant role or position you've held in the last 15 years. For each one, answer these three questions on a 1–5 scale: (1) How much energy did this role give me vs. take from me? (2) How closely did the role match what I'm actually good at? (3) How much of myself did I have to suppress to perform this role? Look at the pattern across all roles. The roles scoring high on energy and low on suppression, that's the zone you're looking for.

Part 2, The Conditions Inventory (10 min)
Complete these sentences as specifically as possible. "I do my best work when the team is ___." "I lose energy fastest when I have to ___." "The problems I find myself working on even when no one is paying me are ___." "The environment where I've felt most like myself professionally was ___ because ___." Do not filter these for what sounds good. Write the actual answer.

Part 3, The Recurring Signal (10 min)
Write down the five pieces of feedback you've received most consistently across different roles, managers, and contexts. Not one-time feedback, recurring feedback. Strip out the performance review language. What's the actual observation underneath it? Now identify which of those recurring signals you've been treating as a weakness to manage versus a strength to build from.

Part 4, The Integration Statement (10 min)
Write one paragraph, not a bullet list, a paragraph, that synthesizes what you've learned from Parts 1–3. Start it with: "The version of me that does my best work is someone who ___." This statement is not your elevator pitch. It's your internal compass for the rest of the PIVOT process.`
          },
          {
            id: "1.2", title: "The Masks Framework™", duration: "60 min", type: "framework",
            content: `Every professional builds masks. This is not a character flaw; it is an adaptation strategy. At some point in your career, you encountered an environment that required you to be something other than what you naturally were. You adapted. The adaptation worked. The mask became part of your professional identity.

The Masks Framework™ has a specific technical definition: a mask is any protective identity you've built that once served a legitimate purpose but now operates automatically, regardless of whether the original threat is still present.

There are four primary mask types in the M2M taxonomy.

The Competence Mask is the most common. It develops when you entered an environment early in your career where your value was based entirely on what you could produce. The Competence Mask says: if I am visibly excellent at everything, I am safe. The cost: you've made yourself indispensable through output rather than influence. You're overworked and under-positioned, and you've trained the people around you to see you as a resource rather than a leader.

The Accessibility Mask develops when early workplace environments punished directness or rewarded agreeableness. It says: if I'm easy to work with, I will not be a target. The cost: you have relationships everywhere and authority nowhere. People like you, but they don't follow you. You've confused being liked with being respected.

The Authority Mask develops in environments where expertise was the only currency, often academic, technical, or military contexts. It says: if I am the most knowledgeable person in the room, I am untouchable. The cost: you've built a moat around your competence that prevents collaboration. People feel evaluated by you, not partnered with you.

The Invisibility Mask is the most damaging for career advancement. It develops when visibility felt dangerous, when being seen led to being targeted, criticized, or held to impossible standards. It says: if I don't take up too much space, I won't be a threat. The cost: your best work goes unnoticed, your ideas get credited to others, and your advancement stalls not for lack of ability but for lack of presence.

You likely wear more than one. Most people have a primary mask and one or two secondary masks that activate in specific contexts.`,
            exercise: `This exercise requires honesty that can feel uncomfortable. Work through it anyway.

Step 1, Mask Identification (15 min)
Read the four mask descriptions again. For each one, rate on a scale of 1–5 how strongly it shows up in your professional behavior. Don't rate who you want to be, rate how you actually show up. If you're not sure, ask yourself: which description made you slightly defensive? That one is probably yours.

Step 2, Origin Story (15 min)
Take your highest-rated mask. Write the specific story of when you first built it. What was the environment? What happened, or what did you observe happening to someone else, that taught you this mask was necessary? Be specific: organization, time period, what you witnessed or experienced. This is not therapy; it is diagnostics. Understanding the origin tells you whether the original threat still exists in your current context.

Step 3, Current Cost Assessment (15 min)
For your primary mask, complete this inventory honestly: (1) List three specific situations in the last 90 days where the mask activated. What triggered it? (2) In each situation, what did you do as a result of the mask? What did you not do? (3) What did each situation cost you, in relationships, in advancement opportunity, in energy, in authenticity? Put actual numbers or names where you can. "It cost me the opportunity to lead the _____ project" is more useful than "it held me back."

Step 4, The Mask Test (15 min)
The mask test asks a single question about each situation you identified: is the original threat still present? If you built a Competence Mask in an environment that penalized vulnerability, are you still in that environment? If you built an Invisibility Mask because being seen felt dangerous, is that still true today? Write your honest assessment. If the threat is gone and the mask is still running, that's the gap you're closing in Phase 2.`
          },
          {
            id: "1.3", title: "The Proximity Paradox™", duration: "45 min", type: "framework",
            content: `The Proximity Paradox™ is the gap between how you see yourself and how the market experiences you. It's not unique to career transitions, it's a universal condition of being inside your own story. But it becomes acutely expensive during a transition because you're making high-stakes positioning decisions based on a map that may be significantly wrong.

Here's how the paradox operates. The longer you've been in a role, an industry, or an organization, the more invisible your most valuable competencies become to you. You've been doing them so long, and so well, that they no longer feel like competencies; they feel like baseline. "Anyone could do this." No. Not anyone. That invisibility is the paradox. The thing you're most qualified to offer is often the thing you've stopped noticing about yourself.

The paradox runs in both directions. Some people dramatically underestimate the breadth of what they offer, they've been a functional expert so long they've forgotten that they also built organizations, led people through crises, translated complex problems for non-technical audiences, and held institutional knowledge that no one else holds. Others overestimate the transferability of specialized expertise; they were the best in a very specific context and assume that excellence translates cleanly to different industries or roles. It rarely does, at least not without translation work.

There's also a third form: the narrative gap. This is where you've done significant work but cannot articulate it in a way that the market recognizes. Your impact is real. Your language for it is either too technical, too humble, or too internal to the organization. The market doesn't know what to do with "I managed the integration of three legacy systems during a corporate restructuring." They do know what to do with "I led a cross-functional team through a $4M systems migration during a period of organizational uncertainty, delivered on time, and retained 94% of the team."

The goal of this module is to close all three forms of the gap.`,
            exercise: `This exercise requires external input, which is the point. You cannot close the Proximity Paradox from inside your own head.

Step 1, The Market Signal Survey (ongoing, 15 min to set up)
Identify five people who have worked with you in the last five years and know your work well. They do not need to be your biggest advocates; they need to be honest. Send each of them this message: "I'm doing some professional reflection and would value your perspective. Could you answer three quick questions? (1) When you think about what I'm genuinely excellent at, what comes to mind first? (2) What do you think I consistently underestimate about myself? (3) If you were recommending me for something, how would you describe what I bring?" Give them permission to be direct.

Step 2, The Invisible Competency Audit (20 min)
Make a list of everything you did in your last two roles that you would describe as "just part of the job." Now interrogate that list. For each item: (a) What percentage of your peers could have done this at the same level? (b) Did you have to develop a non-obvious skill or apply judgment in a non-obvious way to do it? (c) Would it be immediately visible to someone hiring for a different role or industry? Anything that scores low on (a), meaning few peers could match it, is likely a hidden competency. Flag it.

Step 3, The Translation Exercise (20 min)
Take the three competencies you've identified as most likely invisible to the market. For each one, rewrite what you did using this structure: "I [action verb] [specific outcome] by [specific method] during [specific context] which resulted in [measurable or observable impact]." Do not estimate numbers, use real ones. If you don't have numbers, use observable outcomes: "Which resulted in the department being retained during a 40% org reduction." Now read the before and after. The gap between how you were thinking about your experience and how the market will read it, that's the Proximity Paradox closing.`
          },
          {
            id: "1.4", title: "Clarity Checkpoint", duration: "30 min", type: "checkpoint",
            content: `The Clarity Checkpoint is the first authentication gate in the PIVOT OS™ process. Before you build a narrative, before you position yourself in any market, you need a documented foundation. That foundation is what you've built in Phase 1.

This checkpoint is not a performance. It is a diagnostic submission. Kevin reviews every Clarity Checkpoint personally and will provide specific written feedback before you advance to Phase 2. The feedback is not evaluative, it's calibrating. The goal is to surface any significant blind spots in your self-assessment before they get baked into your narrative.

What makes a strong Clarity Checkpoint submission: specificity over generality, honesty over polish, patterns over individual incidents. The clients who advance fastest through PIVOT OS™ are not the ones with the most impressive backgrounds, they're the ones who submitted the most honest Phase 1 work.

One important note: the Clarity Checkpoint is confidential. Nothing submitted here is shared, published, or used outside of your engagement with M2M~Inc. The Trust/Liability Gate is active, and FL/II Doctrine governs all checkpoint reviews.`,
            exercise: `Compile your Phase 1 materials into a single Clarity Checkpoint submission. The submission has four required components.

Component 1, Identity Inventory Summary
Synthesize your work from Module 1.1. Include: your Role Audit results (the pattern, not just the list), your Conditions Inventory completed statements, your Recurring Signal analysis (what the feedback actually means underneath the language), and your Integration Statement. Length: 300–500 words.

Component 2, Mask Profile
From Module 1.2: identify your primary mask, its origin story (one specific story, not a general description), your Current Cost Assessment (three specific situations with actual costs identified), and your Mask Test results (is the original threat still present?). Length: 200–400 words.

Component 3, Proximity Paradox Gap Map
From Module 1.3: compile the Market Signal Survey responses you've received, your Invisible Competency Audit results (which items did you flag?), and your three Translation Exercise rewrites (before and after). Length: 200–300 words plus the translation rewrites.

Component 4, The Honest Assessment
One paragraph, written last, after you've reviewed everything above. Complete this sentence honestly: "The most significant gap between how I've been presenting myself professionally and what I actually bring to the work is ___." This is the hardest paragraph to write. It's also the most important one. Use the chat guide if you're stuck, ask it to help you name what you're circling around without saying directly.`
          },
        ]
      },
      {
        id: 2, name: "Narrative", subtitle: "Story Architecture",
        modules: [
          {
            id: "2.1", title: "The C.A.L.M.™ Framework", duration: "60 min", type: "framework",
            content: `C.A.L.M.™ is the sequence by which a sovereign professional narrative is constructed. The four stages are: Clarity → Authority → Language → Movement. Each stage depends on the one before it. The reason most professional narratives fail is not poor writing, it's premature Language. People skip to crafting the pitch before they've established what they're actually pitching.

Clarity is the foundation. It is not "I know what I want", that's preference, not clarity. Clarity, in the C.A.L.M.™ framework, means: I can articulate specifically what I offer, to whom it's most valuable, and why I am the right person to deliver it, in terms the market recognizes. Most people finish Phase 1 of PIVOT OS™ with raw material for Clarity. This module helps you refine it.

Authority is the evidence layer. It is the documented record, not the claimed record, that substantiates your Clarity. Authority is not your title. It is not your years of experience. It is the specific, observable outcomes you've produced that demonstrate your Clarity claim. The distinction between a claim and a substantiated claim is the difference between "I'm a strong leader" and "I led a 14-person team through a $2.3M product launch during a period of 40% staff turnover and delivered on time." One is an assertion. The other is authority.

Language is where most people start and where most people fail. Professional language, the words you use to describe yourself to the market, is a translation problem. You are translating the richness of your lived experience into a vocabulary that your target audience already uses. If they have to work to understand you, you've lost them before you've made your case. The goal is not impressive language; it is immediately legible language.

Movement is the output stage: how your narrative creates forward momentum. A narrative that doesn't move people, to action, to conversation, to decision, is just biography. Movement means that after someone reads or hears your narrative, they know exactly what to do next. That's not a call to action bolt-on. It's built into the structure of the narrative itself.`,
            exercise: `This module exercise is sequential, do not skip ahead.

Stage 1, Clarity Statement Construction (20 min)
Write your Clarity Statement using this exact structure: "I help [specific audience] achieve [specific outcome] by [specific method], which is particularly valuable when [specific context or condition]." Write it three times, each time making it more specific. Version 1 will probably be too broad. Version 2 will get closer. Version 3 should make someone reading it say "that's exactly what I need" or "that's not for me", and both of those reactions are correct. Vagueness that tries to appeal to everyone reaches no one.

Stage 2, Authority Inventory (15 min)
List six specific outcomes you've produced in your career that directly substantiate your Clarity Statement. Each outcome must follow this structure: [What you did] + [scale or scope] + [time constraint or condition] + [measurable or observable result]. If you can't fill in all four parts, the item doesn't count as authority; it counts as activity. Activity and authority are different things. Authority closes.

Stage 3, Language Audit (15 min)
Take your current LinkedIn headline, your most recent resume summary or objective statement, and the way you typically answer "so what do you do?" Write all three down. Now circle every piece of language that (a) uses industry jargon your target audience might not share, (b) describes inputs rather than outcomes, or (c) could apply to hundreds of other people in your field. Replace each circled item with language that is specific, outcome-focused, and written in your audience's vocabulary, not yours.

Stage 4, Movement Test (10 min)
Read your current narrative back as if you're hearing it for the first time. Ask: after hearing this, what would I do next? If the answer is "I'm not sure" or "nothing specific," your narrative lacks Movement. Write the specific action you want your audience to take after hearing your narrative. Then work backwards: what does the narrative need to communicate to make that action feel obvious?`
          },
          {
            id: "2.2", title: "Your Sovereign Story", duration: "90 min", type: "build",
            content: `The Sovereign Story is the central deliverable of Phase 2. It is not your biography, your elevator pitch, or your LinkedIn About section, though it will inform all of those. The Sovereign Story is the narrative through-line that makes your transition legible, coherent, and compelling to people who have no prior context about you.

Every career transition has a story underneath it. Most people tell the surface version: the one that sounds reasonable and doesn't require the listener to understand context they don't have. The surface version protects you from scrutiny but it also fails to connect. It explains what happened without conveying why it matters. It describes the arc without making the listener feel the arc.

The Sovereign Story has five components, each with a specific job to do.

The Context sets the stage without backstory overload. It answers the unspoken question: "What was this person doing before, and why does it matter for what they're doing now?" It is not a resume review. It is one or two sentences that establish the relevant foundation.

The Tension names the real reason for the transition. Not the polished reason: the real one. This is where most people self-censor and where their story dies. The tension is what made staying untenable, what the previous context couldn't give you, what you recognized about yourself that the existing path couldn't accommodate. The tension makes the transition make sense. Without it, you sound like you're retreating. With it, you sound like you're advancing.

The Turning Point is the moment or realization that made the transition actual rather than theoretical. Every meaningful career transition has one. It might be a specific event, a conversation, a piece of feedback, or a quiet recognition in an ordinary moment. The Turning Point is what gives the story velocity.

The Through-Line connects your past to your present to your future in a way that is coherent and non-apologetic. It answers the hardest question in any career transition narrative: "Why should I trust that you'll be effective in this new context when most of your experience is somewhere else?" The Through-Line doesn't minimize the transition; it reframes it as evidence of a capability the new context specifically needs.

The Landing is where you name the future without over-claiming it. You're not promising outcomes you can't guarantee. You're stating direction with specificity, specific enough that the right people recognize themselves in it, specific enough that the wrong people self-select out.`,
            exercise: `The Sovereign Story is built in drafts. This exercise produces your first substantive draft. Do not try to write the final version in one sitting.

Draft 1, The Raw Version (25 min)
Set a timer. Write your story without editing. The only rule: be honest about the Tension. Include all five components, Context, Tension, Turning Point, Through-Line, Landing, but do not worry about craft or length yet. You will probably write too much. That's correct. Target 400–600 words. When the timer ends, stop.

Draft 2, The Compression (20 min)
Read Draft 1 once, then set it aside. Without looking at it, write the story again in 150 words or fewer. What survived the compression is what actually matters most. What got cut is probably either surface material or something you're not yet sure belongs in the story. Compare Draft 1 and Draft 2. The gap between them tells you where you're over-explaining and where you're under-explaining.

Draft 3, The Tension Test (20 min)
Go back to Draft 1. Find the Tension section. Read it out loud. Ask yourself: is this the real reason, or is this the polished version of the real reason? If you feel slightly exposed reading it, you're probably getting close to the real version. If it feels completely comfortable, it's probably the polished version. Rewrite the Tension section until it feels true but not reckless. Then integrate it back into Draft 1.

Draft 4, The Audience Test (25 min)
Read your story back as if you are the most important person you're trying to reach with this narrative. Not generically, name a specific person or role. What questions does this story answer for them? What questions does it raise that it doesn't answer? What would they need to hear that isn't there yet? Make those additions. Then cut anything that doesn't serve that specific reader. Post your Draft 4 in the chat and ask the Guide: "What am I not saying that I need to say?"`,
          },
          {
            id: "2.3", title: "The Affirmation–Judgment Index™", duration: "45 min", type: "assessment",
            content: `The Affirmation–Judgment Index™ is one of the most operationally useful, and most uncomfortable, assessments in the PIVOT OS™ system. Its premise is simple: there is almost always a gap between what you say you believe about yourself and how you actually behave. The index measures that gap and makes it actionable.

Here's why the AJI™ matters in a career transition. You are about to market yourself to people who have no prior relationship with you. Everything they believe about you will come from what you say, how you say it, and what they can observe. If what you say is "I am a strategic leader with high executive presence" but your actual behavior in high-stakes settings is risk-averse, deferential, and dependent on consensus before making any visible move: the gap between the affirmation and the judgment will be immediately apparent to a discerning evaluator, even if they can't name it precisely. They'll just feel something off.

The AJI™ is not an assessment of your worth. It is an assessment of your alignment. High AJI gap doesn't mean you're not strategic; it means you haven't built the behavioral habits that demonstrate the strategy you claim. That gap is closable. But only if you know where it is.

There are three common AJI gap patterns. The Overaffirming Executive asserts high-level leadership qualities but behaves operationally, jumping into tactical problems, avoiding strategic ambiguity, measuring success through activity rather than outcomes. The Underaffirming Expert has significant capability but consistently frames themselves with hedges, qualifiers, and deference; they say "I tend to be pretty good at..." about things they are genuinely excellent at. The Externally-Dependent Confident affirms confidence strongly in familiar environments but the behavioral evidence evaporates in unfamiliar contexts, every affirmation is context-contingent rather than intrinsic.`,
            exercise: `This assessment requires behavioral evidence, not self-report. Follow the instructions exactly.

Step 1, The Five Affirmations (5 min)
List the five things you most consistently say about yourself professionally. These might be things you say directly ("I'm a strategic thinker") or things embedded in how you describe your work ("I bring a systems perspective to complex problems"). Write them as declarative statements. Do not filter, write the ones you actually use, not the ones you wish you used.

Step 2, The 30-Day Behavior Scan (20 min)
For each affirmation, identify two specific behaviors from the last 30 days, one that supports the affirmation and one that contradicts it. Be specific: actual events, actual decisions, actual moments. "I avoided raising my concern in the meeting on Tuesday the 4th because I wasn't sure how it would land" is evidence. "I sometimes don't speak up" is not. If you cannot find a contradicting behavior, look harder. Everyone has at least one per affirmation.

Step 3, Gap Scoring (10 min)
Rate each affirmation's gap on a scale of 1–5: 1 = strong alignment between what I say and how I behave consistently; 5 = significant and regular gap between what I claim and what I demonstrate. Your highest-scored gap is your first coaching target. Write one sentence explaining why you think this particular gap persists.

Step 4, The Structural Question (10 min)
For your highest-scored gap, answer this: is the gap there because (a) you don't actually believe the affirmation as fully as you claim, (b) you believe it but haven't built the behavioral habit to demonstrate it consistently, or (c) you believe it and have the habit but the environments you're in don't create space for the behavior? The answer determines whether this is a belief problem, a habit problem, or an environment problem, and those require completely different solutions.`
          },
          {
            id: "2.4", title: "Narrative Checkpoint", duration: "45 min", type: "checkpoint",
            content: `The Narrative Checkpoint marks the completion of Phase 2 and the transition to market-facing work in Phase 3. At this point, you should have a documented Clarity Statement, an Authority Inventory, a working Sovereign Story in at least its fourth draft, and an AJI™ gap analysis with your primary gap identified and its root cause named.

The review at this checkpoint is primarily focused on the Sovereign Story. Kevin reads every Narrative Checkpoint submission and provides written feedback on three dimensions: narrative coherence (does the story make sense on its own terms?), market legibility (will the intended audience understand and be moved by this?), and tension authenticity (has the real tension been named, or is this the polished version?).

Common reasons narratives are returned for revision: the Tension is vague or missing; the Through-Line doesn't actually connect past experience to the transition in a way the target audience would find credible; the Landing over-claims or under-specifies; the story sounds like a press release rather than a person.

Use the chat guide before submitting. Paste your Sovereign Story draft and ask specifically: "What is this story not saying that it needs to say?" and "Where does this lose you?" The guide is calibrated to give you the honest answer.`,
            exercise: `Narrative Checkpoint submission has three required components.

Component 1, Sovereign Story (Final Draft)
Submit your Sovereign Story at 300–500 words. It should include all five components: Context, Tension, Turning Point, Through-Line, Landing. Before submitting, read it out loud once. If any sentence sounds like marketing copy rather than a real person speaking, rewrite it.

Component 2, C.A.L.M.™ Stage Assessment
Where are you in the four-stage sequence? Write one paragraph for each stage: (a) Clarity, state your Clarity Statement (the three-version progression from Module 2.1, specifically Version 3), (b) Authority, list your six authority items from the inventory, (c) Language, describe what changed from your Language Audit and what you changed it to, (d) Movement, describe specifically what action you want your narrative to produce and whether your story currently produces it.

Component 3, AJI™ Summary
Your primary gap (the affirmation with the highest score), the specific behavioral evidence you found for the contradicting behavior, and your root cause answer: belief problem, habit problem, or environment problem. Include one sentence describing the specific behavior change you're committing to in Phase 3 to begin closing this gap.`
          },
        ]
      },
      {
        id: 3, name: "Momentum", subtitle: "Market Positioning",
        modules: [
          {
            id: "3.1", title: "The RPA™ Model", duration: "60 min", type: "framework",
            content: `The RPA™ Model, Role, Platform, Audience, is the positioning framework that governs how you enter and navigate a career transition. It solves a specific problem: most people try to change everything simultaneously. New role, new industry, new audience, new platform, all at once. This approach produces the longest job searches, the most inconsistent positioning, and the highest rate of second-guessing.

The RPA™ insight is that you have three positioning variables and you can change all three, but not at the same time, and not without sequencing.

Role is the work itself: what you do, the function you serve, the problems you solve. Platform is the context in which you do it: the industry, the company type, the sector, the organizational structure. Audience is who you serve and how you're recognized: internal stakeholders, external clients, specific communities, specific decision-makers.

The sequencing principle is this: change the axis where you have the most transferable equity first, and use the other two axes as anchors. If you're moving from a corporate HR director role to an independent consultant, you're changing the Platform (corporate to independent) and the Audience (internal to external). Keep the Role relatively stable, you're still doing people strategy work, just in a different structure. The Role equity you carry is what gets you in the door.

If you're moving from one industry to another (Platform change), keep the Role and the within-role Audience relatively stable while you build Platform credibility in the new sector. The mistake is thinking you have to prove yourself on all three axes simultaneously.

There's also an RPA™ trap that's worth naming: the precision trap. Some people get so precise about their ideal RPA™ position that they eliminate 95% of opportunities in the name of perfect fit. The RPA™ model is not a filter, it's a sequence. You start with your primary axis of change and you stay alert to opportunities that honor your constraints on the anchor axes. Movement on one axis creates options on the others.`,
            exercise: `This exercise produces your current-state and target-state RPA™ maps, and your transition sequence.

Step 1, Current-State RPA™ Map (10 min)
Write your current position on all three axes with specificity. Role: not your title, but the actual work: what problems you solve, what methods you use, what decisions you make. Platform: the industry, company type, organizational structure, sector. Audience: who you serve, who values your work, who you report to, who you're known to. Be specific enough that someone could understand your current position without knowing you.

Step 2, Target-State RPA™ Map (15 min)
Write your target position on all three axes. Use the same specificity standard. Then mark each axis: is this a change from your current state? A significant change (more than 30% different), a moderate change (10–30% different), or a minor change (less than 10% different)? You now have a picture of the total distance of your transition.

Step 3, Sequencing Decision (15 min)
Identify your primary axis of change: the one where the distance is greatest or where the change is most fundamental. This is what you lead with in your positioning. Then identify your two anchor axes, where you have the most existing equity and credibility. Write one paragraph explaining: "I am leading my transition on the [Role/Platform/Audience] axis because ___. I am using [the other two axes] as anchors because ___." This paragraph is the strategic logic of your positioning.

Step 4, First Opportunity Profile (20 min)
Based on your sequencing decision, write the profile of the first opportunity you're targeting: the role, the company type, the specific criteria. It should be adjacent to your anchor axes and represent your primary axis of change. Avoid both of these traps: (a) targeting something so similar to your current state that it doesn't represent the transition you're trying to make, (b) targeting something so different from your anchors that you have no evident credibility bridge. The first opportunity is a bridging move, not an arrival.`
          },
          {
            id: "3.2", title: "LinkedIn Architecture", duration: "90 min", type: "build",
            content: `LinkedIn is the primary market-facing document for most professional transitions. This is not a statement about the platform's importance in principle, it's an observation about how hiring managers, executive recruiters, business development targets, and referral networks actually behave. Before a conversation, a decision-maker almost always looks at the LinkedIn profile. What they find there either confirms, complicates, or kills the impression that was forming.

Most LinkedIn profiles are defensive documents. They list what happened, titles, dates, responsibilities, without conveying what it meant or where it's going. They try to cover every possible interest simultaneously and therefore represent nothing with clarity. They use language that sounds impressive in a vacuum and says nothing specific.

A sovereign LinkedIn profile has a different architecture. It is a forward-facing positioning document that uses past experience as evidence for a specific present and future capability claim.

The headline is the most important real estate on your profile. It is the first thing anyone reads, it appears in search results, and it persists across every interaction someone has with you on the platform. Most people use their current or most recent title. That's the equivalent of putting your last address on your business card. The headline should communicate what you do and for whom, in language that your target audience uses.

The About section is where the Sovereign Story lives in a condensed, platform-appropriate form. It is not a professional biography. It should open with something true and specific, a statement, an observation, a problem you're oriented toward, and move quickly to what you offer, for whom, and why the transition you're making is a natural expression of who you've always been. Length: 200–300 words. No bullet lists. Prose.

The Experience section is where most people lose the opportunity. The standard format, bullet points describing responsibilities, is the worst possible format for a transition narrative. Responsibilities describe what you were supposed to do. Outcomes describe what you actually produced. Reframe every significant role as an outcome narrative, not a responsibility list.`,
            exercise: `This exercise rebuilds your LinkedIn profile from the architecture up. Work through each section in order.

Section 1, Headline Rebuild (15 min)
Write your headline three ways: Version A uses the standard "Title at Company" format as a baseline. Version B uses your Clarity Statement structure: what you do + for whom + the outcome they get. Version C takes Version B and compresses it to 12 words or fewer without losing the specificity. Submit Version C, unless Version C loses something essential that Version B captures, in which case submit Version B. Your headline should make someone in your target audience say "I should talk to this person" or allow someone not in your target audience to immediately recognize this isn't for them. Both reactions are correct.

Section 2, About Section Draft (25 min)
Write your About section using this structure. Opening sentence: one true, specific statement about what you care about or what problem you're oriented toward, not "I am a passionate professional." Second paragraph (2–3 sentences): what you do, for whom, and what specifically makes your approach or your background relevant. Third paragraph (2–3 sentences): the Sovereign Story in compressed form: the Through-Line that connects your past to your present without apology. Closing sentence: a specific invitation, not "feel free to connect," but what you're specifically looking for or open to right now. Read the full section out loud. Any sentence that sounds like it was written by someone describing a third party rather than a first person, rewrite it.

Section 3, Experience Reframes (30 min)
Take your two most recent and most relevant roles. For each one, replace the responsibility-based bullet points with three outcome-based statements. Each statement must follow the structure: [Action verb] + [what you did] + [scale or context] + [result]. Then write a two-sentence role framing statement for each position: what was the actual challenge, and what did you bring to it that made the difference? This framing goes at the top of each role section, before the outcome bullets.

Section 4, Gap and Skills Audit (20 min)
Look at your rebuilt profile as a whole. Identify: (a) any gap between your current profile and your target-state RPA™ position that creates doubt rather than credibility, address it explicitly or omit the section; (b) your top five skills as listed on LinkedIn, do they reflect your Clarity Statement or your history? Revise them to reflect where you're going, not where you've been.`
          },
          {
            id: "3.3", title: "The Sully Sequence™", duration: "45 min", type: "framework",
            content: `The Sully Sequence™ is named for the discipline of navigating an unexpected, high-stakes transition without casualties. The reference is to the professional ethos of executing a landing in conditions you didn't plan for, calmly, precisely, without drama, with everyone intact.

Career transitions damage relationships in predictable ways. Not because of bad intentions, because of poor sequencing. The most common mistake: people manage the announcement of their transition without managing the relationship through the transition. They tell people what they're doing without helping those people understand what to do with the information. The result is awkwardness, strained relationships, and lost referral networks.

The Sully Sequence™ has four steps.

Step 1 is Identification: mapping the relationships most likely to be affected, not by your opinion of how they feel about you, but by their actual stake in your current position and the change you're making.

Step 2 is Sequencing: determining the order in which these relationships need to be managed, which depends on the nature of the relationship, the person's network proximity to your target market, and the risk of the relationship being damaged by surprise.

Step 3 is the Conversation Architecture: for each high-stakes relationship, designing the specific conversation: what you say, when you say it, and what you're asking from them versus what you're offering. Most people conflate these: they either ask for too much without offering anything, or they offer so much transparency that they create confusion rather than clarity.

Step 4 is the Follow-Through Protocol: the sequence of actions after the initial conversation that maintains the relationship through the transition. A single conversation is not relationship management. Relationship management during a transition requires intentional, spaced follow-up that keeps the person informed without making them feel burdened.

One important reframe: the people most likely to advance your transition are not the people you're closest to, they're the people in your second and third ring of professional relationships. Close relationships are often too invested in who you've been to see clearly who you're becoming. Acquaintances can see you fresh. The Sully Sequence™ activates both.`,
            exercise: `This exercise maps and sequences the relationship work required by your specific transition.

Step 1, Relationship Mapping (15 min)
List every professional relationship that will be materially affected by your transition. Organize them into four categories: (a) Relationships at Risk, people who may feel blindsided, whose networks overlap significantly with your target market, or whose support you need but whose reaction is uncertain. (b) Active Champions, people who understand your value and will advocate for you without being asked. (c) Passive Assets, people with relevant networks or information who are neutral toward you and could be activated with the right conversation. (d) Exit Managed, people you're leaving behind professionally with whom you need a clean, respectful conclusion. The list should be specific names, not categories.

Step 2, Sequencing Decision (10 min)
Rank your Relationships at Risk in the order you need to manage them. The first criteria is proximity to your target market, manage those relationships before news travels to them secondhand. The second criteria is emotional investment in your current position: the most emotionally invested people need the most direct and earliest conversation. Write the sequence with a rough timeline.

Step 3, Conversation Architecture (15 min)
For your top three Relationships at Risk, design the conversation. For each, write: (a) The opening, one sentence that frames the conversation before you get to the content. (b) The core message: what you need them to understand about your transition in three sentences or fewer. (c) The ask, if you're asking for something (a referral, an introduction, a reference), make it specific. If you're not asking for anything yet, name what you are offering (continued collaboration, introduction to relevant contacts, ongoing relationship). (d) The close, how you end the conversation in a way that leaves the relationship intact and forward-facing.

Step 4, Follow-Through Protocol (5 min)
For each Relationships at Risk conversation, write the follow-up sequence: what you'll do 48 hours after the conversation, what you'll do 30 days later, and what the steady-state ongoing relationship looks like. Write it now, before the conversations happen. People who manage transitions well have the follow-through planned before the conversation begins.`
          },
          {
            id: "3.4", title: "Graduation Checkpoint", duration: "60 min", type: "graduation",
            content: `PIVOT OS™ Graduation is the final authentication gate in your reinvention process. It is not a ceremony and it is not a formality. It is the documented record that the work was done, not performed, done, and that the foundation for your next chapter is real and specific, not aspirational and vague.

Kevin reviews every Graduation Checkpoint personally. The review covers four dimensions: completeness (are all required deliverables present?), specificity (does each deliverable contain real, actionable content or does it stay at the level of aspiration?), coherence (do the deliverables form a unified picture of a specific person with a specific direction?), and authenticity (does this read like someone who has done genuine self-examination, or someone who has done the performance of self-examination?).

Graduation does not mean you're finished. It means the architecture is built. The Sovereign Story is drafted and has been through review. The LinkedIn profile has been rebuilt from the ground up. The RPA™ transition is sequenced. The Sully Sequence™ is mapped. The AJI™ gap is named and a behavioral commitment is in place.

What happens after Graduation: Kevin provides written sign-off and specific next-step guidance. For clients continuing to Phase 4 work (launch, ongoing coaching, placement support), Graduation is the entry point. For clients completing PIVOT OS™ as a self-directed program, the Graduation deliverables are your operational toolkit for the next 90 days.

One final note: the hardest part of PIVOT OS™ is not the work in the modules. The hardest part is submitting work that is honest rather than impressive. If you've been doing the impressive version rather than the honest version, your Graduation Checkpoint will show it, and it will be returned. That's not a failure. That's the system working.`,
            exercise: `The Graduation Checkpoint submission has five required components. Each one has a minimum specificity standard, submissions that don't meet the standard will be returned with specific feedback.

Component 1, Sovereign Story (Final Version)
Your Sovereign Story at 300–500 words. All five components present: Context, Tension (the real one, not the polished one), Turning Point, Through-Line, Landing. Before submitting: read it aloud to yourself. If any sentence sounds like marketing copy or press release language rather than a person speaking, rewrite it. If the Tension section feels completely comfortable to read; it probably needs to go deeper.

Component 2, LinkedIn Architecture Completion
Provide: (a) Your rebuilt headline (Version C from Module 3.2), (b) Your About section final version, (c) Your two reframed Experience entries with opening framing statements and outcome-based bullets. The standard: a recruiter or hiring manager unfamiliar with your background should be able to read the profile and say: I understand what this person does, I understand the transition they're making, and I understand why this person is specifically qualified for the work they're seeking.

Component 3, RPA™ Transition Sequence
Your current-state and target-state RPA™ maps, your primary axis of change identified, and your first opportunity profile. Include one paragraph answering: "Someone looking at my background who doesn't know me would question whether I can succeed in this transition because ___. Here is how my Through-Line addresses that question: ___."

Component 4, Sully Sequence™ Map
Your full relationship map (all four categories with specific names), your sequencing decision with timeline, and your conversation architecture for your top three Relationships at Risk. Not the conversations you've already had: the complete map including conversations still to come.

Component 5, AJI™ Commitment
Your primary gap, its root cause (belief/habit/environment), and one specific, observable behavioral commitment you're making in the next 30 days to begin closing it. The commitment must be specific enough that someone could observe whether you kept it.`
          },
        ]
      }
    ]
  },
  BRIDGE_OS: {
    id: "BRIDGE_OS",
    name: "BRIDGE OS™",
    tagline: "SMB / Employer Transformation",
    icon: "◈",
    audience: "HR Leaders · SMB Owners · Workforce Managers",
    color: "#1a3a6b",
    accent: "#c9a84c",
    intro: "Your organization is losing something, talent, ground, or direction. BRIDGE OS™ is the architecture for transformation that sticks.",
    chatPersona: "BRIDGE Transformation Intelligence",
    systemPrompt: (name, module, themes) => `You are the BRIDGE OS™ Transformation Intelligence, embedded in the M2M~Inc. client portal for employer and organizational transformation.

Contact: ${name || "an employer"}. Current module: ${module}.
Organizational context: ${themes || "workforce transformation, talent retention, organizational change"}.

Your role:
- Help the employer work through transformation decisions with precision
- Reference their specific organizational context when known
- Translate M2M frameworks into their operational language
- Flag implementation risk you detect in their responses
- Never overpromise timelines or guarantee outcomes
- End every response with the next concrete action

Register: C-suite calibrated, ROI-first, process-clear.
Trust/Liability gate active, every recommendation is a starting point, not a prescription.`,
    phases: [
      {
        id: 1, name: "Diagnose", subtitle: "Organizational Assessment",
        modules: [
          {
            id: "1.1", title: "Organizational Health Assessment", duration: "90 min", type: "assessment",
            content: `Most organizations that seek transformation are solving the wrong problem. They've identified a symptom, high turnover, low engagement, declining performance, cultural friction, and they're treating it as the diagnosis. Treating symptoms without diagnosing root causes is how transformation initiatives fail. You spend money, generate activity, and six months later the symptom returns, usually worse, because the system that produced it hasn't changed.

The M2M Organizational Health Assessment maps three axes, each of which can be the source of dysfunction, and each of which requires a different intervention strategy.

Talent Density is the distribution of capability across your organization. It asks: do you have the right people, in the right roles, with the right development? Low talent density is not just about individual performance, it's often a structural problem. People with high capability are in roles that underuse them. People in critical roles lack the support to grow into them. The talent is there; the architecture isn't.

Cultural Coherence is the degree to which the behaviors your organization rewards align with the behaviors your stated values describe. Almost every organization has written values. The question is whether the promotion decisions, the performance reviews, the who-gets-celebrated-in-all-hands meetings, whether those reflect the values or contradict them. The gap between stated and operational values is the primary driver of cynicism, voluntary attrition, and leadership credibility erosion.

Structural Clarity is whether the decision rights, accountability structures, and role expectations in your organization are clear enough that people can make good decisions independently. When structural clarity is low, everything escalates. Leaders spend their time making decisions that should be made three levels below them. Individual contributors feel constantly unsure whether they're empowered to act. Meetings multiply. Accountability diffuses. The organization slows.

All three axes interact. Low talent density in a leadership role degrades cultural coherence. Unclear structure undermines even high-density talent. The assessment maps all three before recommending any intervention.`,
            exercise: `This assessment is designed to surface the gap between leadership's perception of organizational health and operational reality. Complete it in two phases.

Phase A, Leadership Self-Assessment (30 min)
Rate your organization on each axis from 1 to 10, where 1 is severely dysfunctional and 10 is operating at full potential. Then answer three diagnostic questions per axis.

Talent Density: (1) In what percentage of your critical roles do you have someone who is genuinely excellent, not adequate, excellent? (2) Who in your organization is visibly underutilized, doing work significantly below their actual capability? Name them. (3) If you had to replace your three most critical roles tomorrow, how long would it realistically take and how damaging would the gap be?

Cultural Coherence: (1) Name the last three people promoted in your organization. What behaviors were they specifically recognized for? Are those behaviors explicitly reflected in your stated values? (2) What is the most significant behavior that your culture rewards that your values don't mention? (3) What would a new hire observe in their first 90 days that would surprise them given what's written in your onboarding materials?

Structural Clarity: (1) What percentage of decisions that should be made at the individual contributor or first-line manager level routinely escalate to senior leadership? Estimate honestly. (2) Ask three of your direct reports: "Do you know, with certainty, what decisions you're empowered to make without checking with me first?" Their honest answers are your structural clarity score. (3) When something goes wrong in your organization, how quickly and specifically can accountability be assigned? Or does it diffuse?

Phase B, The Ground Truth Gap (30 min)
For each axis, identify the single most important thing that your frontline employees, not your leadership team, would say if asked anonymously. This is the ground truth gap: the difference between what leadership believes about the organization and what people actually experience. The gap size is a measure of organizational risk. Write one honest paragraph per axis describing what you believe the ground truth gap to be and what evidence you're basing that on.

Phase C, Priority Setting (30 min)
Which axis has the largest gap between your leadership self-assessment score and the ground truth? This is your diagnostic priority, not necessarily the most visible problem, but the most foundational one. Write one paragraph: "Our highest-priority organizational health gap is [axis] because [specific evidence]. The root cause is [structural/cultural/talent issue]. The cost of continuing without addressing it is [specific and as quantified as possible]." This paragraph becomes the foundation of your Diagnosis Checkpoint brief.`
          },
          {
            id: "1.2", title: "The Seven Must-Haves for Transformation Readiness", duration: "60 min", type: "framework",
            content: `The Seven Must-Haves framework addresses one of the most expensive mistakes in organizational transformation: launching a change initiative before the organization is ready to sustain it. Most transformation failures are not strategy failures. They're readiness failures. The strategy was sound. The timing was wrong. The organization wasn't prepared to absorb and sustain the change.

The Seven Must-Haves are not aspirational; they are binary. Each one is either present or it isn't. An organization that scores PASS on six and FAIL on one does not have six out of seven. It has a readiness gap that will compromise the entire effort.

Must-Have 1: Executive Sponsorship with Skin in the Game. Not endorsement. Not verbal support at a kickoff meeting. Actual, visible behavior change by the most senior leader in the initiative's scope, time, attention, decisions, trade-offs that signal to the organization that this is real. When the CHRO walks into the Monday morning operations meeting and starts asking transformation-related questions, people believe it. When they don't, they wait for it to pass.

Must-Have 2: A Clear and Honest Diagnosis. Not a business case built to justify a decision already made. A genuine examination of what's broken, why it's broken, and what fixing it actually requires. Organizations that skip honest diagnosis almost always underestimate the scope of the change needed and overestimate the organization's appetite for it.

Must-Have 3: Sufficient and Protected Resources. The transformation has its own budget, its own timeline, and people whose primary job is to drive it, not people doing it as a fifth priority while managing their day job. Under-resourcing a transformation while publicly committing to it is one of the most reliable ways to accelerate cynicism.

Must-Have 4: A Credible Internal Champion at Every Level. Not just leadership alignment, a champion at each organizational level who has both the credibility to be believed and the willingness to be visible. The frontline champion is especially critical: the person on the floor, in the call center, in the field office who is respected by peers and can translate the change into their language.

Must-Have 5: A Communication Architecture That Answers the Real Questions. Not the questions leadership wants to answer. The questions employees are actually asking, which are almost always: "Will I still have a job?", "Will my workload increase?", "Does leadership actually believe this or are we just doing this for the quarter?" Pre-answering these questions, honestly, is the difference between engagement and compliance.

Must-Have 6: A Measurement System That Predates the Initiative. You need baseline data before you begin so you can demonstrate movement. An organization that starts measuring after the initiative launches will always be arguing about whether the numbers reflect the change or reflect noise. Measurement before launch is non-negotiable.

Must-Have 7: An Honest Reckoning with What Will Not Change. Every transformation has a scope, and outside that scope are things that are not changing, structures, systems, people, processes that are remaining as they are. Being clear about what's not changing is as important as being clear about what is. When organizations are vague about the boundaries of the change, people assume everything is on the table, and the resulting anxiety consumes the energy needed for the actual work.`,
            exercise: `Score your organization against each Must-Have honestly. This is a readiness assessment, not a planning document: the goal is to find the gaps before they find you.

For each Must-Have, answer three questions: (1) PASS or FAIL, is this condition present in a meaningful way, not just technically? (2) If FAIL or borderline: what specifically is missing? (3) What is the minimum action required to move this to PASS, and who owns that action?

Work through all seven, then answer two meta-questions.

Meta-Question 1: How many FAILs do you have? If more than two: you have a stabilization problem, not a transformation problem. The recommendation is not to slow down the transformation, it's to identify which FAILs are dealbreakers and address them specifically before the initiative launches. Launching with known FAILs is a choice; just make it consciously.

Meta-Question 2: Of your FAILs, which one would do the most damage if it surfaces publicly, if the employees who are skeptical point to it and say "see, this is why this isn't real"? That is your highest-urgency gap. Write a 90-day remediation plan for that specific Must-Have. Include: what needs to happen, who owns it, what the observable milestone is at 30/60/90 days, and what "PASS" looks like in behavioral terms, not on paper.`
          },
          {
            id: "1.3", title: "Diagnosis Checkpoint", duration: "45 min", type: "checkpoint",
            content: `The Diagnosis Checkpoint is the gate between understanding your problem and building your solution. Kevin reviews every submission personally. The standard for advancing to Phase 2 is not that your organization is ready, many organizations aren't, and that's exactly why they're here. The standard is that you have an honest, specific picture of where you are.

The most common reason Diagnosis Checkpoints are returned: organizations describe their problems in the language of solutions. "We need better communication" is a solution framing. "We have a cultural coherence gap where our stated value of transparency is systematically undermined by a promotion process that rewards people who manage up rather than communicate down, and our turnover data shows the people leaving are disproportionately high performers who cite trust issues", that's a diagnosis.

Use the chat guide to help draft your brief before submitting. Ask it specifically: "Where am I still describing solutions instead of the underlying problem?" and "What am I probably not saying in this diagnosis that needs to be said?"`,
            exercise: `The Diagnosis Checkpoint submission requires three components.

Component 1, Organizational Health Summary (300–400 words)
Using your work from Module 1.1, write the diagnostic summary: your scores on all three axes, the ground truth gap you identified for each, and your priority axis with its root cause and cost-of-inaction analysis. Be specific. "Low cultural coherence" is not a diagnosis. "Our cultural coherence axis scored 4/10 because our promotion decisions in the last 18 months have systematically rewarded politically skilled operators over high-output contributors, which has produced a 28% turnover rate among mid-level performers in the last year and a measurable decline in unsolicited innovation" is a diagnosis.

Component 2, Seven Must-Haves Scorecard
Your PASS/FAIL assessment for all seven Must-Haves, the specific gap identified for each FAIL, and your 90-day remediation plan for your highest-urgency FAIL. If you have more than two FAILs, include a brief assessment of whether this is a stabilization situation or a transformation situation, and what that means for your timeline.

Component 3, The Stakeholder Honesty Test
One paragraph answering this question honestly: "If I shared this diagnosis with the three people in my organization most likely to push back: the skeptics, the cynics, the people who've seen initiatives fail before: what would they say is missing from it?" Then add what they would say to the brief. If you can't think of what they'd say, you haven't done the diagnosis yet.`
          },
        ]
      },
      {
        id: 2, name: "Design", subtitle: "Transformation Architecture",
        modules: [
          {
            id: "2.1", title: "Workforce Architecture", duration: "90 min", type: "build",
            content: `Workforce Architecture is the deliberate design of how work gets organized, who does it, and how accountability flows through the organization. Most companies have an org chart. Org charts show hierarchy. Workforce Architecture maps something different: the operating system beneath the hierarchy: the actual logic by which decisions get made, work gets done, and people understand where they fit.

The distinction between an org chart and workforce architecture is the distinction between a map of streets and a map of traffic. The streets tell you what's there. Traffic tells you what's actually moving and where it's getting stuck.

Role Architecture is the first layer. Role clarity is different from job descriptions. Job descriptions describe inputs: what you'll do. Role architecture describes the value equation: what does this role produce, for whom, and how does that output connect to organizational outcomes? When this is unclear, people default to activity, filling the role with effort and busyness rather than output and impact. High performers leave when role architecture is weak because they cannot measure their own impact and eventually stop trying.

Accountability Architecture is the second layer. Accountability is not the same as responsibility. Responsibility is assigned, it's in the job description. Accountability is owned, it's the thing you don't let fail because you've genuinely internalized its importance. Accountability architecture asks: who has personally committed to what outcome, who can observe that commitment being kept or broken, and what happens when it isn't? Organizations with weak accountability architecture have lots of activity, lots of explanation, and very few people who feel personally answerable for outcomes.

Decision Architecture is the third layer. In most organizations, the de facto decision policy is: escalate when uncertain. This sounds like a conservative, risk-managed approach. In practice it means that the people with the most operational knowledge, frontline employees, first-line managers, are systematically excluded from the decisions they're best positioned to make. The result: slow execution, learned helplessness at the individual contributor level, and leaders who are perpetually overloaded with decisions they shouldn't be making.`,
            exercise: `This exercise produces a Workforce Architecture Assessment for one critical domain of your organization. Choose the domain where the architecture is most broken, not the biggest domain, the most problematic one.

Step 1, Role Architecture Audit (25 min)
List the five to seven roles within your chosen domain. For each role, answer: (a) What is the primary output this role produces, not the activities, the output? (b) Who is the internal or external customer of that output? (c) Does the person in the role know specifically what good looks like, and is that definition shared by their manager? (d) In the last 90 days, was this role producing that output at the required level? If not, is the gap a capability problem, a clarity problem, or a support problem? Write one sentence of diagnosis per role.

Step 2, Accountability Architecture Map (20 min)
For the same domain, identify the three or four outcomes that most need to be reliably produced. For each outcome: (a) Who currently owns it? Is that ownership assigned (in a job description) or genuine (meaning this person would feel personally accountable if it failed)? (b) How is that accountability made visible: what does the person, their team, and their manager see that shows whether the outcome is on track? (c) When accountability breaks down on this outcome, what actually happens? Write what happens honestly, not what the HR process says should happen.

Step 3, Decision Architecture Diagnosis (20 min)
Spend 20 minutes mapping the decision flow for one critical operational decision in your domain. Walk through the last time this type of decision was made: Who initiated the need for a decision? Who had the most relevant information? Who made the decision? How long did it take from need to decision? Could it have been made one level lower in the organization without meaningful additional risk? Write up the actual decision flow and compare it to the ideal flow. The gap is your decision architecture problem.

Step 4, Architecture Prescription (25 min)
For each of the three layers, Role, Accountability, Decision, write one specific architectural change that would produce measurable improvement in the next 90 days. Be specific enough that someone could implement the change without additional clarification from you. "Improve role clarity" is not an architectural change. "Replace the job descriptions for the five roles in the customer success team with a one-page Role Value Document that specifies the output produced, the internal customer, the 90-day success metric, and the specific decision authority held by that role" is an architectural change.`
          },
          {
            id: "2.2", title: "Talent Retention Framework", duration: "60 min", type: "framework",
            content: `Talent retention is one of the most expensive problems in organizational management and one of the most poorly diagnosed. The standard retention intervention, compensation benchmarking, benefits improvements, engagement surveys followed by action plans, addresses the surface layer. It solves for the 20% of attrition that is primarily compensation-driven. It does almost nothing for the 80% that is driven by something else.

The M2M Talent Retention Framework starts from a different premise: people leave at the moment when the cost of staying exceeds the cost of leaving. The cost of staying is not just about compensation or benefits. It is the full experience of being in the organization: the daily reality of the relationship with their manager, the visibility of their path forward, the alignment between the work they're doing and the work they want to be doing, the degree to which they feel seen and valued as a specific person rather than a headcount.

The three primary retention levers in the M2M framework are predictably the three things most organizations measure last and act on slowest.

The Manager Relationship Lever. The quality of an individual's relationship with their direct manager is the single most predictive factor in voluntary attrition. This is not new information; it has been replicated in organizational research across industries for decades. What's less understood is what specifically makes a manager relationship retention-producing versus attrition-driving. It's not likeability. It's not being "nice." It's the degree to which the manager is genuinely invested in the employee's development, clear about expectations, honest about performance, and advocates for the employee's interests inside the organization. Each of these can be assessed and developed.

The Visibility Lever. People need to be able to see a plausible path forward in an organization. Not a guaranteed path, a plausible one. When high performers cannot answer the question "where does this go for me?" they start answering a different question: "where does this go for me somewhere else?" The organizations with the best retention are not the ones with the most elaborate career ladders, they're the ones that have honest, specific conversations about development and trajectory.

The Meaning Alignment Lever. This is the lever most organizations are least equipped to address because it's the most individual. What makes work feel meaningful is different for different people, and it's not always what people expect. For some it's impact, seeing their work connect to an outcome that matters. For others it's mastery: the feeling of growing in capability. For others it's belonging, being part of a team or community that genuinely values them. Retention strategy that treats all high performers identically will systematically fail the segment that doesn't fit the assumed profile.`,
            exercise: `This exercise builds a data-driven retention analysis for your organization.

Step 1, Exit Interview Audit (15 min)
Pull the last ten voluntary departures from your organization. For each one, answer: (a) What was the stated reason for leaving? (b) What do you believe was the real reason? (c) Was the departure foreseeable, were there signals in the months before they left? (d) Which of the three levers, Manager Relationship, Visibility, Meaning Alignment, was most likely the primary driver? Map the ten departures against the three levers and look for the pattern. Which lever appears most frequently as the real driver?

Step 2, Retention Risk Audit (20 min)
Identify your five to ten highest-value employees: the people whose departure would have the most significant operational impact. For each person, assess honestly: (a) How strong is their manager relationship right now, on a scale of 1–5? (b) Can they clearly articulate what their next step in this organization looks like? Have you had that conversation recently? (c) Do you know what makes their work feel meaningful to them specifically? Have you deliberately created conditions for that in the last 90 days? Any person with two or more low scores is a flight risk. Name the flight risks. Don't rationalize.

Step 3, The Manager Audit (15 min)
Your managers are the most important retention variable you control. Identify your three highest-turnover managers and your three lowest-turnover managers. What are the observable behavioral differences between the two groups? Not the personality differences: the behavioral differences. What specifically do your lowest-turnover managers do that the highest-turnover managers don't? Write the answer. That difference is your retention development program.

Step 4, 90-Day Retention Plan (10 min)
For each of your identified flight risks: write one specific retention action in each of the three lever categories, Manager Relationship, Visibility, Meaning Alignment. Each action must be scheduled, owner-assigned, and specific enough to be observable. "Have a development conversation" is not an action. "Scheduled a 60-minute career conversation with [name] for [date] to specifically address their expressed interest in leading the [project] initiative and map a concrete 12-month development path" is an action.`
          },
          {
            id: "2.3", title: "The BRIDGE Change Model", duration: "90 min", type: "framework",
            content: `The BRIDGE Change Model addresses the sequencing problem that kills most transformation initiatives. The problem: organizations try to sustain a change before they've stabilized it. They try to shift culture before they've addressed the structural conditions that created the current culture. They announce the new future before they've decommissioned the old one.

The BRIDGE model has three phases, each with non-negotiable conditions for advancement.

Phase 1: Stabilize. Before you can change direction, you need to stop the bleeding. Stabilize addresses the acute symptoms: the highest-urgency talent losses, the most critical trust deficits, the most destabilizing structural gaps. Stabilize is not transformation. It is creating the conditions in which transformation can occur. Organizations that skip Stabilize and jump directly to transformation almost always find themselves managing a cascading crisis rather than a managed change. The indicators that you're in a Stabilize situation: key talent is visibly unhappy or actively departing, leadership credibility with the frontline is at or below 50%, or the organization has been through two or more failed transformation attempts in the last three years.

Phase 2: Shift. Shift is where the transformation actually happens. It is the deliberate, sustained change in behavior, systems, and structures that moves the organization from its current state to its target state. The defining characteristic of Shift is that it requires visible, consistent behavior change from leadership, not just sponsorship. The leaders who are most resistant to Shift are often the leaders whose behavior most needs to change. This is the political challenge of BRIDGE transformation, and it is where most initiatives stall.

Shift has three components. Structural Shift is the redesign of systems, processes, and accountability structures so that the new behaviors are supported and the old behaviors are no longer rewarded. Cultural Shift is the sustained change in what is celebrated, promoted, and tolerated: the visible, behavioral signal to the organization about what the new standard is. Capability Shift is the development investment that builds the skills and knowledge the new state requires that people don't currently have.

Phase 3: Sustain. Most organizations declare victory in Phase 2 and stop. Six months later, the old patterns have returned. Sustain is the institutionalization work that makes the change permanent, embedding it in hiring criteria, onboarding, performance management, promotion criteria, and leadership development. Sustain is complete when the organization can describe the changed state as "how we do things here" rather than "the initiative we did."`,
            exercise: `This exercise identifies your current phase in the BRIDGE model and builds your transition plan to the next phase.

Step 1, Phase Diagnosis (20 min)
Read each phase description carefully. Answer these questions honestly: (a) Has the acute bleeding stopped? Are your highest-priority talent risks stabilized? Is leadership credibility above 50% across all levels? If not, you're in Stabilize. (b) If you're in Shift: are the structural, cultural, and capability components of Shift all actively in progress, or are one or two being neglected? Which one is furthest behind? (c) If you're claiming to be in Sustain: can you point to specific evidence that the changed behavior has been embedded in hiring, onboarding, promotion, and performance management? Or are you declaring victory based on leadership-level behavior change while the systems still reward the old patterns?

Step 2, Phase Transition Requirements (25 min)
Write the specific, observable conditions that would allow you to advance from your current phase to the next. These are not aspirations; they are gate criteria. For Stabilize to Shift: what specific evidence would you need to see that the acute situation is stable enough to begin the transformation? For Shift to Sustain: what specific structural and process changes would need to be in place before you could claim the change is self-sustaining? Write these as behavioral, observable milestones, not as feelings or morale indicators.

Step 3, Leadership Behavior Map (25 min)
For each phase in the BRIDGE model, identify the three to five specific leader behaviors that are most critical in that phase. Now assess your current leadership team against those behaviors. Which leaders are demonstrating the behaviors required for your current phase? Which leaders are demonstrating behaviors that belong to a different phase, either stuck in Stabilize mode when you're in Shift, or acting like you're in Sustain when you're not? Name specific people and specific behaviors. The leadership behavior gap is usually the most important execution gap in BRIDGE transformation.

Step 4, 30/60/90-Day BRIDGE Plan (20 min)
Write your BRIDGE plan for the next 90 days. For each 30-day period: what phase are you in? What are the three to five most critical actions? Who owns each action? What is the observable milestone that tells you the 30-day period was successful? This plan will become the foundation of your Design Checkpoint submission.`
          },
          {
            id: "2.4", title: "Design Checkpoint", duration: "45 min", type: "checkpoint",
            content: `The Design Checkpoint is the gate between diagnosis and deployment. At this point, you should have a clear organizational health picture, a Seven Must-Haves readiness scorecard, a Workforce Architecture assessment with specific prescriptions, a Talent Retention analysis with a 90-day action plan, and a BRIDGE phase diagnosis with a 30/60/90-day plan.

Kevin reviews every Design Checkpoint with a specific question in mind: is this organization ready to move to deployment, or does it need more design work first? The most common reason checkpoints are returned: the design is sound on paper but the political reality of the organization hasn't been accounted for. The plan assumes leadership alignment that doesn't exist. The plan assumes resource availability that hasn't been confirmed. The plan is built for an idealized version of the organization rather than the actual one.

The honest test of a strong Design Checkpoint submission: could you hand this document to your most skeptical board member or C-suite colleague and have them say, "I understand the problem, I understand the proposed approach, and I understand why this approach addresses the root cause rather than the symptom"? If not, there's more design work to do.`,
            exercise: `Four components, each with a specificity standard.

Component 1, Transformation Blueprint Summary
Write your transformation blueprint in one page or fewer. Include: the primary organizational health gap and its root cause; your Seven Must-Haves scorecard with the specific remediation plan for any FAILs; your Workforce Architecture prescription (the specific changes to Role, Accountability, and Decision architecture); your current BRIDGE phase and the criteria for advancing to the next phase. Use your most critical internal skeptic as the imagined reader.

Component 2, Retention Action Plan
Your flight risk list (names, not categories), your manager audit findings, and your 90-day retention action plan with owner, date, and observable milestone for each action. Be specific: "Scheduled" means a date is on the calendar, not that it's on the to-do list.

Component 3, Leadership Alignment Assessment
An honest assessment of your leadership team's readiness for Shift. Who is aligned and behaving accordingly? Who is aligned in principle but not yet changing behavior? Who is resistant and why? For each resistant leader: what is the specific concern driving resistance, and what is your plan to address it? "They'll come around" is not a plan.

Component 4, The Honest Gap
One paragraph: what is the thing most likely to cause this transformation to fail, given everything you know about your specific organization and your specific leadership team? Name it. Then describe what you're doing about it.`
          },
        ]
      },
      {
        id: 3, name: "Deploy", subtitle: "Implementation",
        modules: [
          {
            id: "3.1", title: "Launch Protocol", duration: "60 min", type: "build",
            content: `The first 30 days of any organizational transformation initiative are disproportionately consequential. Not because the most important work happens in the first 30 days; it doesn't. But because the first 30 days are when the organization forms its beliefs about whether this initiative is real or whether it's the latest in a series of programs that will eventually quiet down.

Every organization has an immune system. It recognizes change initiatives as potential threats to existing equilibria and activates resistance mechanisms: passive non-compliance, increased cynicism from people who've seen it before, surface agreement combined with behavioral inertia, and in some cases active undermining by people whose position or influence depends on the current state.

Launch Protocol is the disciplined sequencing of actions that establishes credibility before the immune system fully activates. The window is approximately 30 days. After 30 days, the organization's belief about whether this initiative is real has largely been formed and is much harder to change.

A high-credibility launch has four characteristics. It shows before it tells: the first signal of change that employees receive is behavioral, not communicative. A leader makes a different decision than they would have made before. A meeting changes format. A process that was previously frustrating gets removed. The behavioral signal comes first; the communication explains what people have already seen.

It addresses the stated skepticism directly; it doesn't avoid the "we've seen this before" energy, it names it and responds to it with specificity. "We know there have been previous initiatives. Here is specifically how this one is different, and here is what you should observe in the next 30 days that will demonstrate that difference."

It creates early wins that are real, not manufactured, solving a problem that employees have been asking about, removing an obstacle that has been in the way, demonstrating that something changed because of this initiative that wouldn't have changed without it.

And it sustains the same level of leadership attention at day 25 that it had at day 1. The most reliable signal that an initiative isn't real: leadership attention drops off after the kickoff.`,
            exercise: `This exercise produces your Launch Protocol: the specific 30-day action sequence for your transformation initiative.

Step 1, The Credibility Baseline (15 min)
Before designing your launch, assess your current credibility baseline: (a) What is the current level of trust in leadership among your frontline employees, not your estimate, but evidence-based? (b) How many transformation or change initiatives have been launched in your organization in the last three years? Of those, how many succeeded, partially succeeded, or quietly faded? (c) Who are the three or four people in your organization whose visible support would most increase the credibility of this initiative with the skeptics? Are they on board, and what specifically would it take for them to be visible?

Step 2, The First Week Signal (15 min)
Design the first signal: the behavioral action by a senior leader that will happen before any formal communication. This action should: address something that employees have identified as broken or frustrating; be visible to a broad enough audience that word spreads quickly; and require no explanation; it should speak for itself. Write the specific action, the specific leader who will take it, the specific date, and the specific audience who will observe it.

Step 3, The 30-Day Sequence (20 min)
Map the first 30 days in weekly intervals. For each week, identify: (a) The primary visible action: what happens this week that demonstrates progress? (b) The communication milestone: what do employees hear, from whom, and in what format? (c) The resistance signal to watch for: what specific response from the organization would indicate that the immune system is activating, and what is your response protocol? Write each week specifically, not "leaders will communicate" but "on [date], [specific leader] will hold a 20-minute open Q&A with the [specific team] specifically to address questions about [specific aspect of the initiative]."

Step 4, The Skeptic Conversation (10 min)
Identify the most vocal skeptic in your organization: the person most likely to say "here we go again" and mean it. Write the specific conversation you need to have with this person before the public launch. Not to neutralize them, to genuinely engage with their concern and give them a reason to be a cautious observer rather than an active detractor. The skeptic who is specifically engaged before the launch and sees their concern taken seriously is often more valuable to the initiative than an enthusiastic champion who hasn't been challenged.`
          },
          {
            id: "3.2", title: "Communication Architecture", duration: "60 min", type: "framework",
            content: `Communication in organizational transformation is not messaging. Messaging is what organizations produce when they're trying to manage a narrative. Communication is what organizations do when they're trying to inform and engage the people doing the actual work.

The distinction matters because employees in transformation situations are not passive recipients of messages. They are active interpreters. They take every formal communication and run it through a filter built from their history with the organization: "Is this true?" "Is this the full picture?" "What are they not saying?" "What does this mean for me specifically?" An organization's communication architecture determines whether the filter produces engagement or cynicism.

Most organizational communication fails at one of three layers. The Altitude Layer: leaders communicate at the strategic altitude, "We are transforming our culture to be more collaborative and innovative", without translating that statement to the operational level. Frontline employees cannot act on statements made at strategic altitude. They need to know: what does this mean for me specifically, in my role, in my day-to-day work, this week? The Authenticity Layer: the communication sounds like it was written by a committee and approved by legal. It has no honest acknowledgment of difficulty, no admission of what isn't known yet, no genuine response to the real concerns employees have. People can recognize corporate communication at fifty feet, and it produces distance. The Completeness Layer: organizations communicate what they know and are comfortable communicating, and they leave gaps everywhere else. People fill gaps with the most anxiety-producing interpretation available. Proactive, honest communication about what is unknown is more trust-building than waiting until you have complete information.

The Communication Architecture framework maps the full communication requirement for your transformation: who needs to hear what, from whom, in what format, at what frequency, and through what channel. The architecture is designed before the initiative launches, not improvised as the initiative unfolds.`,
            exercise: `This exercise builds your full Communication Architecture for the transformation initiative.

Step 1, Audience Map (15 min)
Identify all distinct audiences within your transformation scope. These are groups that have meaningfully different stakes, different concerns, and different needs from the communication. Common audiences: the board or senior leadership (need strategic picture and risk management), middle managers (need operational clarity and support for their own communication responsibilities), frontline employees (need specificity about their day-to-day reality), high-value talent at flight risk (need visible evidence that their concerns are understood), skeptics and cynics (need honest engagement with their specific objections). Map your specific audiences with a one-sentence description of their primary concern.

Step 2, The Real Questions (15 min)
For each audience, write the three questions they are most urgently asking that they may not be asking out loud. Not the questions you want to answer: the questions they're actually sitting with. For most frontline employees this includes: "Will I still have a job?", "Will my workload go up?", and "Is this real or will it fade?" For middle managers it often includes: "Am I being set up to fail?", "What authority do I actually have?", and "If my team doesn't respond well, who is accountable, me or the initiative?" Write the real questions before you design the communication.

Step 3, Communication Architecture Matrix (20 min)
Build a simple matrix: audiences across the top, communication channels down the side (all-hands, team meetings, email updates, 1:1 conversations, informal channels). For each cell, write whether this channel is appropriate for this audience and what it should deliver. Then identify the three most critical communication moments in the first 60 days: the moments where the right or wrong communication will most significantly affect the trajectory of the initiative, and design those communications specifically.

Step 4, The Manager Communication Enablement Plan (10 min)
Middle managers are your most important communication channel and your most underprepared one. They will be asked questions they don't know how to answer, by people they need to maintain trust with. Write a plan for how you will equip your managers: (a) What will they be told, when, and before the broader communication? (b) What specific questions do you anticipate they'll be asked, and what are the honest answers? (c) What support will they have access to when they encounter questions they can't answer? The manager who has to say "I don't know" too many times becomes a credibility liability rather than a communication asset.`
          },
          {
            id: "3.3", title: "Measurement Framework", duration: "45 min", type: "build",
            content: `The measurement problem in organizational transformation is not a data problem. Most organizations have more data than they can act on. The measurement problem is a clarity problem: organizations measure what's easy to measure rather than what matters, and they measure outcomes when they need to be measuring the behaviors and conditions that predict outcomes.

The leading vs. lagging indicator distinction is the most important concept in transformation measurement. A lagging indicator tells you what happened. A leading indicator tells you what is likely to happen. Employee engagement scores are a lagging indicator; they measure the result of culture, leadership behavior, and work experience, usually with a six-to-twelve-month lag. The manager behaviors that produce high engagement scores are leading indicators, they're measurable now, they predict the engagement score months in advance, and they're actionable.

Most transformation measurement frameworks are almost entirely lagging indicators: retention rates, engagement scores, productivity metrics, revenue per employee. These tell you after the fact whether your transformation worked. By the time the lagging indicators turn, you've lost 12–18 months of intervention opportunity.

The M2M Measurement Framework is built on three levels. The board level measures lagging outcomes at 12+ month intervals, retention rates, productivity measures, financial performance, engagement scores. The leadership level measures leading organizational behaviors at monthly intervals, manager behavior indicators, decision escalation rates, cultural coherence markers, talent mobility metrics. The operational level measures real-time activity signals at weekly or bi-weekly intervals: the early warning signals that tell you whether the transformation is taking hold or whether the immune system is winning.

The critical design principle: identify your leading indicators before the initiative launches, establish your baselines, and build your measurement cadence into your governance structure. A measurement framework that's designed after launch is always retrofitting, trying to establish causality in data that was collected without a hypothesis.`,
            exercise: `This exercise builds your three-level measurement framework.

Step 1, Outcome Definition (10 min)
Write three to five specific, measurable outcomes that would constitute transformation success at the 12-month mark. These should be lagging indicators: the results you'll see if the transformation worked. For each outcome: what is it, how will you measure it, what is your current baseline, and what is your target? Be as specific as possible. "Improved engagement" is not an outcome. "Employee Net Promoter Score of 35+ (current baseline: 18) as measured by quarterly pulse survey, sustained for two consecutive quarters" is an outcome.

Step 2, Leading Indicator Identification (20 min)
For each lagging outcome, identify two to three leading indicators: the behaviors, conditions, or signals that, if present, predict that outcome will be achieved. Think specifically: what would you observe in your organization three to six months before the outcome changes that would tell you the change is coming? For retention outcomes: early leading indicators might include manager relationship quality scores, visible promotion of internal mobility, and frequency of development conversations. Write your leading indicators with the same specificity standard as your outcomes: what is it, how will you measure it, what is the baseline, what is the target?

Step 3, Early Warning System (10 min)
Identify three to five signals that would tell you, in the first 60 days, that the transformation is in trouble. These are the canary indicators, not outcome measures, but early behavioral and organizational signals that tell you the immune system is winning. Examples: key early adopters going quiet on Slack, a notable increase in decision escalation, a specific skeptic becoming more vocal, an informal leader starting to distance themselves from the initiative visibly. Write your specific canary indicators and assign an owner who will monitor each one.

Step 4, Measurement Governance (5 min)
Write a one-paragraph description of your measurement governance: who sees which metrics, at what frequency, in what format, and with what authority to make course corrections based on what they see? A measurement framework without governance is an observation exercise. Governance is what turns measurement into management.`
          },
          {
            id: "3.4", title: "Stakeholder Management", duration: "60 min", type: "framework",
            content: `Stakeholder management is one of the most underinvested disciplines in organizational transformation, not because leaders don't understand its importance, but because it's uncomfortable. It requires having honest assessments of people's positions, motivations, and likely behaviors. It requires treating colleagues and leaders as political actors in a system, which feels clinical and sometimes disloyal. And it requires making deliberate choices about where to invest relationship capital that most leaders would prefer to distribute indiscriminately.

The M2M Stakeholder Framework uses four categories, and the most important thing to understand about them is that people move between categories based on information, experience, and relationship, but only if they're deliberately managed.

Champions are people who actively support the transformation and will advocate for it with their own credibility and social capital. Champions are not just people who said "yes" in the kickoff meeting. Champions are people who will still be advocating at month four when the initiative has hit its first significant challenge. Identify them carefully. Over-relying on nominal champions who won't sustain their support is worse than having fewer champions; it creates the appearance of broader support than actually exists.

Skeptics are people who are unconvinced but open to persuasion. They've seen initiatives fail before. They have legitimate questions that haven't been answered yet. They're not your enemy, they're your most valuable validation mechanism. A skeptic who becomes a champion based on evidence is far more credible to the broader organization than a genuine believer. Skeptics deserve the most honest communication and the most substantive engagement. Treating them as obstacles to be managed rather than concerns to be addressed is the most reliable way to turn them into blockers.

Blockers are people who are actively working against the transformation, directly or through strategic inaction, resource withholding, or narrative undermining. The most important thing to understand about blockers: their resistance is almost always rational from their perspective. They have a specific stake in the current state, a relationship, a source of influence, a position that the transformation threatens. Understanding the specific stake is more important than understanding the person. When you address the stake, the resistance often follows.

Bystanders are the silent majority. They're watching, forming judgments, and waiting to see which way the wind blows before committing. They're not passive, they're calculating. When the initiative demonstrates real momentum, bystanders typically move toward Champion or Skeptic. When it falters, they move toward Blocker. Bystanders are managed through credibility, consistency, and early wins, not through direct engagement.`,
            exercise: `This exercise produces a specific stakeholder management plan for your transformation.

Step 1, Stakeholder Mapping (20 min)
List all significant stakeholders in your transformation initiative, everyone whose support or opposition could materially affect the outcome. For each person, assign a category: Champion, Skeptic, Blocker, or Bystander. Then write one sentence per person describing the specific stake they have in either the success or failure of this transformation. Not their general orientation, their specific stake.

Step 2, Blocker Analysis (15 min)
For each Blocker, write a specific analysis: (a) What specific aspect of the transformation threatens them? Is it a loss of influence, a change to their team or role, a challenge to their approach, a threat to a relationship? Be specific, "they don't like change" is not an analysis. (b) Is this person's resistance based on a legitimate concern about the transformation, or is it purely self-protective? Both types are real, but they require different responses. (c) What would need to change, in the initiative design, in the communication, in a direct conversation, for this person to move from Blocker to Skeptic? Note: moving a Blocker to a Champion is rarely achievable. Moving them to a Skeptic is a meaningful win.

Step 3, Skeptic Engagement Plan (15 min)
For your two or three most important Skeptics: the ones whose shift to Champion would have the greatest organizational impact, write a specific engagement plan. For each: (a) What is the core concern driving their skepticism? (b) What specific evidence or experience would address that concern? (c) What is the timeline for providing that evidence? (d) Who should have the direct conversation with them, and when? The engagement plan is not a persuasion plan, it's a truth-telling plan. Give the Skeptic what they need to make an informed judgment.

Step 4, Bystander Activation Strategy (10 min)
Bystanders move based on organizational signals, not direct engagement. Write three to five specific organizational signals in the first 60 days that are designed to move Bystanders toward active support. These should be visible, credible, and connected to things Bystanders already care about, team outcomes, workload, manager behavior, resource availability. Each signal should be an observable event, not a communication.`
          },
          {
            id: "3.5", title: "Graduation Checkpoint", duration: "60 min", type: "graduation",
            content: `BRIDGE OS™ Graduation is the authentication that your transformation architecture is complete, honest, and ready for deployment. Kevin reviews every submission against two standards: is it real, and is it complete?

Real means the document reflects your actual organization: the political dynamics, the specific people, the genuine gaps, rather than an idealized version of what you wish your organization was. The most common reason BRIDGE Graduation Checkpoints are returned: the design is technically sound but politically naive. It doesn't account for the specific Blocker who will undermine Phase 1. It assumes the leadership alignment that was claimed in the kickoff meeting has actually been sustained.

Complete means all five Phase 3 deliverables are present at the required specificity level. The specificity standard is: could someone unfamiliar with your organization read this document and have enough information to execute the plan? If the answer is "they'd need a lot more context from me," the document isn't specific enough.

One honest note about Graduation: some organizations arrive at this checkpoint and discover they're not ready to deploy. The Design work revealed gaps that require more stabilization. The stakeholder mapping revealed blockers that haven't been addressed. The measurement framework exposed a lack of baseline data that makes the initiative unmeasurable. This is not failure. This is the system working. Better to identify these gaps in a checkpoint than in month four of a deployment that's failing.`,
            exercise: `The BRIDGE Graduation Checkpoint requires five components. Each must meet the specificity standard: specific enough to be executed by someone unfamiliar with your organization.

Component 1, Transformation Blueprint
Your complete organizational health diagnosis (all three axes with root causes and cost-of-inaction), your Seven Must-Haves scorecard with remediation plans, your Workforce Architecture prescriptions for all three layers, your BRIDGE phase diagnosis and the specific criteria for phase advancement. One document, maximum six pages.

Component 2, 90-Day Implementation Plan
Week-by-week actions for the first 30 days and monthly milestones for days 31–90. Each action: what happens, who owns it, who observes it, and what the completion criterion is. No vague milestone language, every milestone must be specific and observable.

Component 3, Measurement Framework
Your three-level metric stack (board, leadership, operational), baselines for each metric, targets with timelines, your leading indicator set, your early warning canary indicators, and your measurement governance description. Ready to share with your board.

Component 4, Stakeholder Management Plan
Your full stakeholder map (all categories with specific names), your Blocker analysis with remediation strategies, your Skeptic engagement plans with timelines, and your Bystander activation strategy.

Component 5, The Honest Deployment Assessment
One paragraph, unfiltered: given your specific organization, your specific leadership team, and your specific political context, what is the most likely reason this transformation will fall short of its full potential? What are you doing about it, and what are you not doing about it and why? This paragraph is not for the document, it's for the Graduation review. It should be the most honest paragraph in the submission.`
          },
        ]
      }
    ]
  },
  HUMAN_OS: {
    id: "HUMAN_OS",
    name: "Human OS™",
    tagline: "Enterprise / GovCon / C-Suite",
    icon: "◉",
    audience: "Enterprise Leaders · Federal Agencies · C-Suite · GovCon",
    color: "#1a3a6b",
    accent: "#c9a84c",
    intro: "At enterprise altitude, the complexity compounds. Human OS™ is the architecture for systemic change, at board level, at federal scale, at the intersection of human capital and organizational destiny.",
    chatPersona: "Human OS™ Strategic Intelligence",
    systemPrompt: (name, module, themes) => `You are the Human OS™ Strategic Intelligence, embedded in the M2M~Inc. enterprise portal.

This is a board-level environment. Every response reflects that altitude.

Contact: ${name || "an executive"}. Module: ${module}.
Context: ${themes || "enterprise transformation, GovCon, C-suite leadership, human capital strategy"}.

Your role:
- Operate at the intersection of organizational systems, human capital, and strategic execution
- GovCon contexts: be precise about certifications, regulations, and compliance (CMMC, DFARS, SAM.gov)
- Enterprise contexts: ROI-first, board-ready language, systemic thinking
- Never hedge with generic disclaimers, be specific or be silent
- End with the next executive action

Register: C-suite. Earned. Precise. No filler.
Trust/Liability gate at maximum sensitivity.`,
    phases: [
      {
        id: 1, name: "Align", subtitle: "Executive Readiness",
        modules: [
          {
            id: "1.1", title: "Executive Presence Audit", duration: "90 min", type: "assessment",
            content: `Executive presence is one of the most frequently mentioned and least rigorously defined capabilities in organizational leadership. It is invoked to explain promotions, cited as a reason for derailment, and listed as a development need in more performance reviews than almost any other capability, and yet most organizations cannot define it with enough specificity to develop it intentionally.

The Human OS™ Executive Presence Audit uses a behavioral definition: executive presence is the consistent and credible demonstration of strategic clarity, decision authority, and cultural leadership in conditions of ambiguity, complexity, and organizational stress. It is not appearance, voice, or charisma. It is behavioral track record.

The audit measures five dimensions.

Strategic Clarity is the degree to which your communications, decisions, and priorities consistently reflect a coherent, forward-looking understanding of what the organization is trying to achieve and why. The behavioral evidence: when you speak in any forum, can people, at all levels, consistently extract a clear strategic message, or do they leave uncertain about the direction? When you make decisions, are they clearly traceable to a strategic logic, or do they appear reactive and context-dependent?

Decisiveness Under Pressure is the degree to which you make quality decisions at the required pace under conditions of incomplete information, organizational conflict, or external volatility. The most common executive derailment pattern is not bad decision-making, it's decision avoidance. The executive who waits for full information before deciding is almost always waiting for certainty that will never come. Behavioral evidence: what is the average cycle time from problem identification to decision in your domain? How often are decisions reopened or reversed under pressure?

Cultural Authority is the degree to which your behavior is experienced by the organization as a reliable signal of what is valued and what is not. You have cultural authority when people in your organization make decisions asking themselves "what would [your name] decide here?", and when the answer they arrive at is the right one. You lack cultural authority when people in the organization are uncertain about your actual values versus your stated values, when they've observed a gap between what you say and what you reward.

Stakeholder Trust is the accumulated credibility with the full range of stakeholders whose support you require: board members, direct reports, peers, external partners, regulators, customers. Stakeholder Trust is built slowly through consistency and damaged quickly through inconsistency or surprise. The behavioral evidence: when you have a difficult message to deliver, do stakeholders receive it as honest and considered, or do they question your motives? When you're not in the room, are you represented accurately by the people who are?

Communication Precision is the degree to which your communication produces the intended effect reliably across different audiences, formats, and stakes levels. This is distinct from being a good speaker; it is the ability to translate complex, nuanced strategic thinking into language that is immediately actionable for the specific audience in front of you. The behavioral evidence: do your communications regularly require follow-up clarification? Do different audiences consistently receive different messages from the same communication?`,
            exercise: `This audit requires both self-assessment and external validation. The external validation is not optional.

Step 1, Behavioral Self-Assessment (30 min)
Rate yourself on each of the five dimensions from 1 to 10. For each dimension, write two to three specific behavioral examples from the last 90 days that support your rating, one that supports the high end of your rating, one that reveals the gap. Do not write about aspirational behavior or behavior in ideal conditions. Write about behavior in the conditions where the dimension is most tested: under pressure, in conflict, when the stakes are highest, when you're most likely to revert to default.

Step 2, The Calibration Survey (setup: 15 min; responses: allow 5 business days)
Identify four to six people who observe your executive behavior regularly and will give you honest feedback. They should represent multiple organizational levels and relationship types, direct reports, peers, a superior, and if possible an external stakeholder. Send each person a calibration request with this specific framing: "I'm doing a formal executive presence assessment and I'd like your honest input on my behavioral patterns. Specifically: (1) In your experience of my leadership, what is the most consistent strength you observe? (2) Where do you most often see a gap between how I intend to show up and how I actually show up? (3) In situations of high organizational stress or complexity, what behavior change in me would most increase your confidence in the organization's direction?" Allow people to respond in writing to ensure honest input.

Step 3, Gap Analysis (20 min)
When calibration survey responses come in, synthesize them against your self-assessment. Where do your self-ratings align with how others experience you? Where are there significant gaps, either in the positive direction (you're underselling a strength) or in the negative (you're significantly overrating yourself on a dimension)? The gaps are your development priorities. Write one paragraph per significant gap: what the gap is, what behavioral pattern is producing it, and what the organizational cost of the gap is.

Step 4, Development Priority Statement (15 min)
Identify the single Executive Presence dimension where closing the gap would most increase your organizational effectiveness in the next 12 months. Write a one-page development priority statement: the specific behavioral gap, the current organizational cost, the specific behavioral change required, and the observable milestones that would tell you at 30, 60, and 90 days that the gap is closing. This statement should be specific enough to use as the basis of a coaching engagement.`
          },
          {
            id: "1.2", title: "Organizational Systems Diagnosis", duration: "90 min", type: "framework",
            content: `Enterprise dysfunction is systemic. This is one of the most important and least understood principles in organizational leadership. When performance is below target, when transformation initiatives consistently underdeliver, when talent leaves faster than it can be replaced: the instinct is to look for individual causes: the wrong leader, the wrong strategy, the wrong team. These explanations are comforting because they're solvable. Replace the leader. Revise the strategy. Rebuild the team. And yet the same patterns re-emerge six months after the changes are made.

Systemic problems survive individual interventions because the system is designed, often unintentionally, but designed nonetheless, to produce the outcomes it's producing. The Organizational Systems Diagnosis maps four systemic drivers that, when misaligned or broken, produce dysfunction that no individual intervention can permanently fix.

Governance Architecture describes how authority, accountability, and decision rights are distributed across the organization. Governance problems masquerade as individual problems: "this leader can't make decisions," "this team doesn't own their outcomes," "this function doesn't align with the rest of the business." When you see these patterns recurring across different people and teams, the governance architecture is the system-level cause.

Incentive Architecture describes what the organization actually rewards, not what the values statement says it rewards, but what the promotion decisions, the bonus structures, the informal recognition, and the performance management process actually reward. Incentive architecture is the most powerful predictor of organizational behavior. People do what they're rewarded for doing, and they stop doing what isn't rewarded, regardless of what they're told they should do.

Information Architecture describes how information flows through the organization, who has access to what, when, and in what form. Poor information architecture produces strategic misalignment: divisions working at cross-purposes because they're operating on different versions of the competitive landscape. It produces coordination failures: hand-off breakdowns, duplicated work, and the silo effects that every organization claims to be addressing and almost none of them actually fix.

Cultural Architecture describes the informal rules that govern behavior: the unwritten standards about what's acceptable, what's valued, and what gets you in trouble. Cultural architecture is reproduced through organizational stories (who gets celebrated and for what), through selective enforcement (what rule-breaking is tolerated and what isn't), and through the behavior of the most senior leaders, which is treated by the organization as the most reliable signal of the actual rules regardless of what's formally stated.`,
            exercise: `This diagnosis requires a systemic lens, not "who is causing this problem" but "what system is producing this pattern."

Step 1, Pattern Identification (20 min)
Identify three to five persistent organizational problems, problems that have survived leadership changes, strategy revisions, and previous intervention attempts. For each problem: describe the pattern specifically (not "lack of accountability" but "decisions made in Q-branch meetings are regularly not implemented by the teams responsible for implementation, producing a pattern of strategic misalignment between the executive team and operational management"). Rate each problem on how long it has persisted and how many previous interventions have been attempted without lasting success.

Step 2, Systemic Root Cause Analysis (30 min)
For each persistent problem, map it against the four systemic drivers. For each driver, ask: does the problem have roots here? Governance: is this pattern enabled by an ambiguity or gap in decision rights or accountability structure? Incentive: are the people involved being rewarded for the behavior that produces this problem, and penalized (or at least not rewarded) for the behavior that would solve it? Information: is the problem sustained by a gap in who has access to what information? Cultural: is this behavior consistent with the informal rules of "how things work around here," even if it contradicts the formal rules? Most persistent problems have roots in two to three of the four drivers.

Step 3, Systemic Intervention Design (25 min)
For your highest-priority persistent problem, design an intervention at the systemic level, not the individual level. For each driver where you identified roots: what specific structural change would address the driver? "Improve accountability" is not a structural change. "Restructure the Q-branch meeting to include implementation owners as co-sponsors of decisions, with a documented decision record distributed to all affected teams within 24 hours and a 30-day implementation status check built into the Q-branch cadence" is a structural change. Write one structural intervention per driver.

Step 4, The Systemic Honesty Test (15 min)
For your highest-priority persistent problem: if you implemented all of the structural interventions you've designed, what systemic driver would still be operating to undermine the fix? There is almost always one. Name it, and name the reason it's harder to address than the others, usually because fixing it requires the most senior leaders to change their behavior, which is the most politically difficult kind of structural change. Write one paragraph about this gap and what it would take to address it.`
          },
          {
            id: "1.3", title: "Alignment Checkpoint", duration: "45 min", type: "checkpoint",
            content: `The Alignment Checkpoint closes Phase 1 of Human OS™ and establishes the diagnostic foundation for Phase 2 systems design. The standard for advancement is the same as all Human OS™ checkpoints: is this real, and is it board-ready?

Board-ready means a reasonably informed board member could read this material, understand the specific challenge, assess the proposed approach against the diagnosis, and make an informed judgment about whether to proceed. It does not mean the document is polished or political. It means it is honest and specific.

The most common reason Alignment Checkpoints are returned at the Human OS™ level: the Executive Presence Audit is self-assessment only, without the external calibration that makes it valid. At enterprise altitude, self-assessment without external validation is not sufficient. The organizations that most need an honest executive presence audit are almost always the ones where the senior leader's self-perception is most inflated. The calibration survey is not optional.

Use the chat guide before submitting. At Human OS™ altitude, the guide is calibrated to boardroom precision. Ask it to stress-test your diagnosis before you submit: "Where is this diagnosis most likely to be challenged by a board skeptic, and how do I address that?"`,
            exercise: `Three required components, each at board-ready specificity.

Component 1, Executive Presence Audit Summary
Your five-dimension behavioral assessment, your calibration survey synthesis (external input integrated, not just summarized), your gap analysis with organizational cost assessment, and your single development priority statement with 30/60/90-day milestones. Include the most honest insight from the external calibration: the thing that surprised you most or that you found most difficult to receive.

Component 2, Organizational Systems Diagnosis
Your three to five persistent problems with pattern descriptions, your systemic root cause analysis mapped against all four drivers, and your structural intervention design. For each intervention: what is it, who owns it, what changes in the organization when it's implemented, and what is the timeline? Include the systemic honesty test paragraph, naming the driver that's hardest to address and why.

Component 3, Board-Ready Alignment Brief
One to two pages maximum. Write it as if you're presenting to your board or to the most demanding senior stakeholder in your system: the systemic challenge we are addressing and why previous interventions haven't resolved it; the root cause at the systemic level (not the individual level); the proposed Phase 2 and Phase 3 approach and what it will require from senior leadership; the cost of not addressing it over the next 24 months, quantified as specifically as possible; and what the organization looks like at 18 months if the intervention succeeds. Write this last.`
          },
        ]
      },
      {
        id: 2, name: "Architect", subtitle: "Systems Design",
        modules: [
          {
            id: "2.1", title: "Human Capital Strategy", duration: "120 min", type: "build",
            content: `Human capital strategy is one of the most frequently declared and least operationally real elements of enterprise strategy. Most organizations have a statement about their people being their most important asset. Very few have a specific, measurable, funded strategy for acquiring, developing, retaining, and deploying that asset in a way that produces competitive advantage.

The gap is not a values gap, most leaders genuinely believe people are important. The gap is a strategic discipline gap. Human capital is treated as an operational function (HR manages it) rather than as a strategic investment with required return. The organizations that consistently outperform their sectors on talent, and there is substantial research evidence that talent quality predicts financial performance, treat human capital with the same analytical rigor that they apply to capital allocation, market positioning, and technology investment.

The Human OS™ Human Capital Strategy framework has four components.

Acquisition Architecture is the deliberate design of how you attract, assess, and select the talent your strategy requires. Most organizations have a recruiting process; few have an acquisition architecture. The distinction: a recruiting process fills open positions. An acquisition architecture continuously builds the pipeline of specific talent capabilities that the strategy requires, whether positions are open or not. It defines the specific capability profile that differentiates your top quartile performers from your median performers, and it designs sourcing, assessment, and selection to identify and acquire that profile.

Development Infrastructure is the system by which talent capability grows over time. Most organizations have training programs. Few have development infrastructure. The distinction: training programs deliver content. Development infrastructure produces behavior change. The most effective development infrastructure in enterprise contexts combines structured learning (formal programs, cohort experiences) with applied practice (stretch assignments, cross-functional projects, action learning) with mentorship and sponsorship (access to senior leaders who invest their social capital in specific people's advancement).

Retention Economics is the quantification of the financial case for retention investment. The standard turnover cost calculation (replacement cost = 1.5–2x annual salary) is a starting point. The retention economics framework goes further: it quantifies the institutional knowledge cost (what the departing person knew that no one else knows), the customer relationship cost (what client relationships follow the departing person), the team performance cost (how team performance changes during the search, hiring, and ramp-up period), and the cultural cost (what signal does this departure send to the remaining team about whether this is an organization they want to build their career in?). When the full retention economics are calculated, the business case for aggressive retention investment becomes much clearer.

Succession Design is the explicit plan for how critical roles will be filled when they become available, through promotion, retirement, departure, or organizational change. Most organizations have a succession plan for the CEO and perhaps two or three other C-suite roles. Few have succession clarity below that level. The organizational risk is concentrated in the roles where there is no successor within 18 months of readiness and no pipeline being built.`,
            exercise: `This exercise builds a Human Capital Strategy diagnostic and a 12-month investment framework.

Step 1, Acquisition Architecture Audit (25 min)
Answer these questions with honest specificity: (a) Can you articulate the specific capability profile: the behavioral and cognitive attributes, not just the credentials and experience, that differentiates your top-quartile performers from your median performers? If yes, write it. If no, write why this isn't documented and what it would take to build it. (b) What percentage of your hires in the last 18 months came from proactive pipeline-building versus reactive vacancy-filling? (c) What is your average time-to-productivity for a new hire at the individual contributor level, the manager level, and the director level? How does this compare to what it should be? (d) In your last five senior hires, what percentage of candidates were known to your organization before the position was open? If the percentage is low, you don't have an acquisition architecture, you have a search process.

Step 2, Development Infrastructure Assessment (25 min)
Map your current development infrastructure against the three components: structured learning, applied practice, mentorship and sponsorship. For each component: what exists? Who has access to it? What evidence do you have that it produces behavior change rather than knowledge transfer? The hardest question: what percentage of your highest-potential employees have a specific, documented 18-month development plan that their manager has committed to supporting? Name the number honestly.

Step 3, Retention Economics Calculation (25 min)
Select your five highest-value employees. For each one, calculate the full retention economics: replacement cost (recruitment, selection, on-boarding), institutional knowledge cost (what do they know that would take 12 months or more to rebuild?), customer relationship cost (what client or partner relationships are at risk if they leave?), team performance cost (how does team performance change during a 6-month vacancy and ramp period?). Total these costs. Now compare the total to the investment required to eliminate the retention risk. For most high-value employees, a $30–50K investment in development, compensation adjustment, or role enrichment eliminates a $250–500K attrition risk.

Step 4, Succession Architecture (25 min)
Map your 10 most critical roles: the roles where a vacancy would most significantly affect organizational performance. For each role: who is the current incumbent? Who is the named successor, if one exists? What is the successor's readiness timeline? What is the backup if the named successor is not available? For any role where there is no identified successor within 18 months of readiness: this is a succession risk. Quantify the risk. Build a 90-day development plan for each gap.`
          },
          {
            id: "2.2", title: "GovCon Readiness", duration: "90 min", type: "framework",
            content: `Federal procurement is a system with rules, certifications, processes, and timelines that reward organizations that prepare systematically rather than respond reactively. The organizations that build consistent GovCon revenue streams are not necessarily the ones with the best capabilities, they're the ones that have done the readiness work before the opportunity surfaces.

The Human OS™ GovCon Readiness framework maps four dimensions of federal procurement readiness.

Certification and Registration Status covers the foundational requirements that must be in place before any federal opportunity can be pursued: SAM.gov registration (active and current), CAGE code assignment, UEI, relevant set-aside certifications (SDVOSB, VOSB, 8(a), HUBZone, WOSB, EDWOSB, VBE), and GSA Schedule contract if applicable. Each certification has specific eligibility requirements, documentation standards, and annual maintenance obligations. Certification gaps discovered after an opportunity is identified are rarely closable in time to bid.

Past Performance Portfolio is the documented record of prior federal contract performance. For most set-aside categories, past performance is a significant evaluation factor in source selection. A well-structured past performance portfolio goes beyond the contract record; it includes specific performance metrics, customer satisfaction documentation, letters of appreciation or commendation, and CPARS ratings where available. Organizations that treat past performance documentation as an afterthought consistently underperform in competitive GovCon environments.

Capability Statement Architecture is the design of the core marketing document used in federal business development. Most capability statements are generic overviews of services. A high-performing capability statement is customized to agency context and opportunity type, positions the firm's certifications as relevant to the agency's acquisition strategy, connects past performance directly to the requirement, and includes differentiators that are specific and documentable rather than generic and aspirational.

Pipeline Development and BD Strategy covers the systematic identification, qualification, and development of federal opportunities before they reach the solicitation stage. GovCon BD is not reactive; it is a 12–24 month pipeline that identifies opportunities from the pre-solicitation stage, builds agency relationships, establishes teaming arrangements, and positions the organization for source selection. Firms that only engage at the solicitation stage are competing on price rather than on relationship and positioning.`,
            exercise: `This exercise produces a GovCon readiness assessment and a 90-day gap closure plan.

Step 1, Certification and Registration Audit (20 min)
Conduct a complete status check on all relevant certifications and registrations. For each: current status, expiration or renewal date, any pending actions, and any known eligibility risk. Specifically: SAM.gov registration, when does it expire and is it current? CAGE code, assigned and active? SDVOSB verification: what is the current verification status through SBA VetCert? GSA Schedule, which schedules, which SINs, when does each expire? VBE certification, through which certifying body, current status? For any certification that is expired, pending, or at risk: what is the specific remediation action and who owns it?

Step 2, Past Performance Portfolio Assessment (20 min)
List your five most relevant federal engagements from the last five years. For each: contract number, agency, contract type (IDIQ, FFP, T&M, CPFF), period of performance, dollar value, performance narrative (two to three sentences), available documentation (CPARS rating, customer letter, performance metrics), and the NAICS codes and PSC codes associated with the work. Assess: do these engagements, as currently documented, constitute a compelling past performance portfolio for your target agencies and opportunity types? What is missing that a source selection official would want to see?

Step 3, BD Pipeline Audit (25 min)
Map your current federal business development pipeline. For each active opportunity in development: opportunity name and agency, estimated value, solicitation expected date, your current relationship with the contracting officer or program office, teaming arrangements in place or needed, your competitive position (incumbent, preferred vendor, new entrant), and your probability of award estimate and its basis. Then answer: what percentage of your pipeline consists of opportunities where you have an established agency relationship versus opportunities where you're responding to a solicitation without prior engagement? The ratio tells you whether you have a BD strategy or a proposal operation.

Step 4, GovCon Readiness Score and 90-Day Plan (25 min)
Rate your readiness on a scale of 1–10 across all four dimensions. For any dimension scoring 6 or below: write the specific 90-day remediation plan with owner, milestone at day 30, milestone at day 60, and completion criteria. The 90-day plan should be specific enough to assign to a person and track weekly. "Improve past performance portfolio" is not a plan. "Develop CPARS narrative and performance metrics summary for the last five federal engagements, produce one-page past performance writeup per engagement in SAM.gov format, and obtain customer letters for three engagements, completed by [date], owned by [name]" is a plan.`
          },
          {
            id: "2.3", title: "AI Integration Architecture", duration: "90 min", type: "build",
            content: `AI integration at enterprise scale is not primarily a technology problem. Most organizations that struggle with AI adoption have adequate technology access; they have vendor relationships, API access, pilot programs, and employees who are experimenting with AI tools individually. The failure mode is not a capability gap. It's a governance gap.

Without governance, AI adoption at enterprise scale produces three predictable problems. Fragmentation: different teams adopt different tools for the same function, producing incompatible data, inconsistent outputs, and an inability to build institutional knowledge about what works. Liability exposure: AI-generated outputs that have not been reviewed by a qualified human are distributed internally and externally, creating legal, reputational, and accuracy risks that the organization has not assessed. And talent disruption: employees who perceive AI as a threat to their roles disengage, become covert resistors, or depart, taking institutional knowledge with them.

The Human OS™ Sovereign Automation Framework addresses AI governance at the structural level. It defines where AI executes autonomously, where human authentication is required before any AI output is distributed, and how the Trust Gate functions as the quality and liability management mechanism across the entire stack.

The framework has four structural components.

Execution Classification: a documented taxonomy of AI use cases within the organization, categorized by the consequences of error. High-consequence uses, client communications, financial projections, legal documents, strategic recommendations, require human authentication before distribution. Low-consequence uses, internal research synthesis, first-draft generation, data formatting, can be AI-executed with periodic human review. The execution classification determines where the Trust Gate is placed.

Authentication Architecture: the specific human review process for each high-consequence use category. Authentication is not simply reading an AI output; it is the specific review conducted by a person with domain expertise sufficient to identify errors, the specific criteria against which the output is evaluated, and the documented sign-off that creates accountability for the authenticated output.

Audit Infrastructure: the logging, tracking, and review system that maintains a record of AI executions, authentication decisions, and output quality over time. At enterprise scale, audit infrastructure is required for regulatory compliance, for continuous improvement of AI use policies, and for demonstrating to clients and partners that AI is being used responsibly.

Capability Integration: the organizational learning system that captures what's working, what's failing, and what new use cases are worth developing, and feeds that learning back into the execution classification and authentication architecture. AI governance without learning is static; it manages current risks but doesn't adapt to new capabilities or emerging risks.`,
            exercise: `This exercise builds your organization's Sovereign Automation Framework.

Step 1, AI Use Case Inventory (20 min)
Document all current AI use within your organization, official deployments, vendor integrations, and individual employee use of tools like ChatGPT, Claude, Copilot, and similar platforms. For each use case: the function, the tool, the frequency of use, who uses it, what the output is used for, and whether the output is reviewed by a human before being acted on or distributed. Be honest, include informal and individual use, not just officially sanctioned deployments.

Step 2, Consequence Classification (20 min)
Apply a three-tier consequence classification to each use case: Tier 1 (high consequence, errors could damage client relationships, create legal liability, or produce incorrect strategic decisions), Tier 2 (medium consequence, errors are costly but correctable, primarily internal impact), Tier 3 (low consequence, errors are easily caught and corrected, no material risk). For each Tier 1 use case: does a human review process currently exist? Is it documented and consistently applied? Who is accountable for the quality of the output?

Step 3, Trust Gate Design (25 min)
For your three highest-consequence AI use cases, design a Trust Gate: (a) What review criteria must the output meet before it can be distributed or acted on? Be specific, not "review for accuracy" but the specific accuracy standards relevant to this use case. (b) Who is qualified to conduct the review? What expertise is required? (c) What is the documented sign-off process, how is authentication recorded and who is accountable? (d) What is the escalation path if the reviewer is uncertain or identifies a material issue? Write the Trust Gate design for each use case specifically enough that it could be implemented by someone unfamiliar with your organization.

Step 4, Governance Implementation Plan (25 min)
Write a 90-day AI governance implementation plan: (a) The policy document that classifies all current use cases by tier (who writes it, who approves it, by when?). (b) The authentication processes for Tier 1 use cases (who designs them, who trains the authenticators, by when?). (c) The audit infrastructure (what system logs executions and authentications, who reviews the audit log, at what frequency?). (d) The employee communication, how do you communicate the governance framework to employees, including specifically addressing the concern that AI governance is about monitoring individuals rather than managing organizational risk? Include: the employee message, the messenger, and the forum.`
          },
          {
            id: "2.4", title: "Architecture Checkpoint", duration: "45 min", type: "checkpoint",
            content: `The Architecture Checkpoint closes Phase 2 and establishes the design foundation for Phase 3 enterprise execution. At Human OS™ altitude, the checkpoint is reviewed against board-ready standards: is the diagnosis accurate, is the design sound, and is the implementation realistic given the specific political and organizational context?

The most common reason Architecture Checkpoints are returned: the AI Integration Architecture is technically sophisticated but organizationally naive. It designs a governance framework without addressing how the most resistant senior leaders will be brought into compliance. Or the Human Capital Strategy is analytically rigorous but doesn't account for the compensation and budget constraints that will limit what's actually possible in the next 12 months.

The honest test: present your Architecture to your most skeptical board member in your head. Where do they push back? Address those pushbacks in the submission before you get them in the review.`,
            exercise: `Four components required.

Component 1, Human Capital Strategy Document
All four components (Acquisition, Development, Retention, Succession) with specific gap assessments, quantified retention economics for your five highest-value employees, succession risk map for your ten most critical roles, and a 12-month investment framework with specific actions, owners, and milestones.

Component 2, GovCon Readiness Scorecard
Your four-dimension readiness assessment, your certification and registration audit with any gaps and remediation plans, your past performance portfolio assessment with a documentation improvement plan, and your BD pipeline audit with an honest competitive position assessment.

Component 3, Sovereign Automation Framework
Your AI use case inventory with consequence classification, your Trust Gate designs for Tier 1 use cases, and your 90-day governance implementation plan. Include your honest assessment of the organizational resistance to governance, which leaders or teams are most likely to resist the framework, and what is your strategy for managing that resistance?

Component 4, The Board Brief
A two-page maximum summary of Phases 1 and 2: the systemic challenge identified in Phase 1, the strategic design decisions made in Phase 2, what Phase 3 execution requires from the board or senior leadership in terms of decision authority, resource commitment, and behavioral change, and what the organization looks like at 24 months if the architecture is implemented fully. Write this last. Write it as if you're presenting to the most demanding person in your governance structure.`
          },
        ]
      },
      {
        id: 3, name: "Activate", subtitle: "Enterprise Execution",
        modules: [
          {
            id: "3.1", title: "Implementation Sequencing", duration: "90 min", type: "build",
            content: `Implementation sequencing is the strategic discipline of ordering actions in a way that maximizes compounding, where the completion of each initiative creates the conditions that make the subsequent initiatives more likely to succeed. Most enterprise transformation plans treat sequencing as a scheduling problem: what can we fit in which quarter? Implementation sequencing treats it as a strategic problem: what must happen first to make everything else possible?

The sequencing challenge at enterprise scale is that almost everything is interconnected. Changing the governance structure affects the incentive architecture. The incentive architecture affects talent retention. Retention affects institutional knowledge availability. Institutional knowledge affects AI governance quality. A plan that treats each of these as independent work streams will produce coordination failures, unintended consequences, and progress that stalls because a prerequisite that wasn't identified wasn't completed.

The sequencing methodology has three steps.

Dependency Mapping: identifying the causal relationships between all major initiatives on your transformation agenda. For each initiative pair, ask: does Initiative A need to be partially or fully complete before Initiative B can succeed? Does Initiative B produce outputs that Initiative A requires? Does completing Initiative A first create organizational conditions that make Initiative B easier or harder? Dependency mapping produces a network diagram, not a Gantt chart.

Critical Path Identification: once dependencies are mapped, the critical path is the sequence of initiatives where a delay in any one produces a delay in all subsequent dependent initiatives. The critical path is where you concentrate your most reliable leadership, your most protected resources, and your most attentive governance. Everything off the critical path can tolerate some delay; critical path items cannot.

Momentum Architecture: the design of early wins that build organizational confidence and executive credibility for the more difficult subsequent work. Early wins should be: genuinely valuable (not manufactured or trivial), relatively achievable (winnable within 90 days with current resources and capabilities), and connected to the transformation narrative (demonstrating progress toward the stated goal, not just activity). Organizations that don't architect early wins often find that their first significant challenge, which arrives in every transformation, happens before they've built enough organizational belief in the initiative to weather it.`,
            exercise: `This exercise produces your implementation sequence for Phase 3.

Step 1, Initiative Inventory (20 min)
List all major implementation actions from your Phase 2 architecture, Human Capital Strategy, GovCon, AI Governance, and any organizational change initiatives from Phase 1. Group them into three categories: (a) Foundation work, must be done before much else can succeed; (b) High-leverage work, produces the greatest strategic value when completed and unlocks other work; (c) Later-stage work, important but dependent on the foundation and leverage work being in place. Do not use calendar sequencing for this categorization, use strategic logic.

Step 2, Dependency Mapping (25 min)
For each initiative in your Foundation and High-Leverage categories, map its dependencies: what must be true before this initiative can begin? What does this initiative produce that other initiatives require? Build a dependency diagram, even a rough one on paper is sufficient. The goal is to make the network of dependencies visible so you can sequence intelligently rather than in parallel when dependencies require sequencing.

Step 3, Critical Path Definition (20 min)
Identify your critical path: the sequence of initiatives where delay propagates. Write the critical path as a narrative: "We begin with [Initiative A] because it creates [specific condition]. When [specific milestone] is reached, we begin [Initiative B] in parallel with completing [Initiative A]. [Initiative B] must reach [specific milestone] before [Initiative C] can begin, because [reason]." The narrative form forces clarity about the strategic logic in a way that a Gantt chart doesn't.

Step 4, Early Win Architecture (25 min)
Identify three early wins, specific, achievable, genuinely valuable outcomes that can be delivered within the first 60 days of Phase 3. For each: what is it? Why is it genuinely valuable (not just visible)? How does it connect to the transformation narrative? What does it demonstrate to skeptics and bystanders? Who delivers it, what resources does it require, and what is the observable milestone? Then identify the communication plan for each early win, not a press release, but the specific way you make the win visible to the audiences whose continued support you most need.`
          },
          {
            id: "3.2", title: "Stakeholder Activation", duration: "60 min", type: "framework",
            content: `At enterprise scale, stakeholders have constituencies. This is the key distinction between stakeholder management in organizational transformation and stakeholder management at enterprise altitude. When a C-suite executive moves from Skeptic to Champion, they don't just add their own credibility to the initiative; they bring their entire network, their organization, their team, and in many cases their external relationships. When they move from Champion to Skeptic, the same multiplier works in reverse.

Enterprise stakeholder activation is not influence management. It is genuine engagement with the complexity of what each stakeholder is managing. A CFO who is skeptical about the transformation's ROI is not an obstacle; they are a person managing fiduciary responsibility to a board and shareholders, with legitimate concern about resource allocation. A General Counsel who is resistant to AI governance changes is not resistant to AI; they are managing legal liability in a rapidly evolving regulatory environment. Understanding the specific complexity each stakeholder is managing is the precondition for genuine activation.

The Human OS™ Stakeholder Activation model has three phases.

Diagnosis: mapping not just the stakeholder's current position but the specific concern, constraint, or competing obligation driving that position. At enterprise altitude, positions are almost always rationally motivated, people at this level have learned to protect their interests precisely. The diagnosis question is not "why are they resistant?" but "what specifically do they need to be confident about before they can commit?"

Engagement Design: the design of a specific engagement, meeting structure, information provided, questions asked, commitments offered, that addresses the diagnosed concern rather than the stated position. Most stakeholder engagement fails because it engages the position rather than the underlying concern. Presenting more data to a CFO who says "I don't see the ROI" doesn't work if the underlying concern is "I don't trust the assumptions in this model." The engagement needs to address the trust gap, not the data gap.

Activation Protocol: the specific sequence of subsequent interactions that maintains momentum, demonstrates progress, and deepens commitment over time. Activation is not achieved in a single meeting. It is a sustained relationship process that turns tentative support into institutional commitment.`,
            exercise: `This exercise builds enterprise-altitude stakeholder activation plans for your three most critical stakeholders.

Step 1, Enterprise Stakeholder Mapping (15 min)
List your 10 most critical stakeholders for Phase 3 implementation. At enterprise altitude, these typically include: board members, C-suite peers, operational leaders whose teams will be most affected, external partners (clients, prime contractors, agency contacts), and regulatory or governance contacts where relevant. For each stakeholder, write two sentences: their current position on your transformation initiative and the specific complexity they are managing that most directly affects that position.

Step 2, Activation Diagnosis (25 min)
Select your three highest-priority stakeholders: the ones whose activation would most significantly advance Phase 3 success. For each, answer these questions: (a) What specific outcome does this stakeholder need before they can commit? Not what they've said they need: what the underlying concern actually requires. (b) What information would they need to be confident that this outcome is achievable? (c) What is the risk they're managing that this initiative potentially exacerbates, and how does your implementation plan address it? (d) Who in their network do they trust most and will listen to about this initiative? Is that person already engaged?

Step 3, Engagement Design (15 min)
For each of the three priority stakeholders, design a specific engagement: the meeting or conversation format, the specific information you'll bring, the questions you'll ask rather than statements you'll make, the specific commitment you're seeking (and the intermediate step if full commitment isn't achievable yet), and what you'll offer in return. Write the engagement as a brief conversation guide, not a script, but a structured approach.

Step 4, Activation Protocol (5 min)
For each engagement, write the follow-through protocol: what happens in the 48 hours after the meeting, what you'll deliver or report back within 2 weeks, and the 90-day cadence for maintaining and deepening the relationship. Activation is a process, not a meeting.`
          },
          {
            id: "3.3", title: "Performance Architecture", duration: "60 min", type: "build",
            content: `Enterprise performance architecture is the design of how organizational performance is defined, measured, communicated, and managed across all levels of the organization. It is not the same as a performance management system, that is one component. Performance architecture is the comprehensive system that ensures every level of the organization is measuring the right things at the right frequency with the right accountability for acting on what the measurement reveals.

Most enterprise performance management systems have two structural failures. The first is altitude misalignment: metrics designed for the board are being reviewed by front-line managers, and operational metrics that would inform strategic decisions are never aggregated to the executive level. The result is that leaders at every level spend time reviewing metrics that aren't actionable for them, while the metrics that would inform their decisions are either not being collected or not being surfaced. The second is temporal misalignment: organizations measure outcomes quarterly that are determined by behaviors and conditions that play out over weeks. By the time the quarterly review reveals the problem, the opportunity to course-correct has passed.

The Human OS™ three-level performance architecture aligns altitude and temporal cadence for all performance measurement.

Level 1, Board Metrics are outcome measures reviewed at quarterly or annual intervals, focused on the longest-cycle strategic outcomes. Financial performance, market position, talent health indicators (voluntary turnover, engagement index, leadership pipeline depth), and mission achievement metrics. Board metrics answer: are we achieving the outcomes that define organizational success?

Level 2, Leadership Metrics are leading organizational behavior indicators reviewed monthly, focused on the conditions and behaviors that predict Level 1 outcomes. Leadership team decision quality, cross-functional coordination effectiveness, talent development investment, cultural coherence indicators, strategic initiative progress. Leadership metrics answer: are we building the conditions that will produce the outcomes?

Level 3, Operational Metrics are real-time activity signals reviewed weekly or bi-weekly, focused on the day-to-day execution behaviors that drive Level 2 conditions. Team performance indicators, individual accountability measures, implementation progress, early warning signals. Operational metrics answer: is the work happening at the required quality and pace?`,
            exercise: `This exercise builds your three-level performance architecture for the Phase 3 implementation.

Step 1, Current Measurement Audit (15 min)
List every metric you currently review regularly. For each: which level does it belong to (Board/Leadership/Operational)? At what frequency is it reviewed? Who reviews it? Is it being reviewed by the right level, is it actionable for the people reviewing it? Identify metrics that are being reviewed at the wrong level (operational metrics in board review, strategic metrics that frontline managers are expected to respond to).

Step 2, Level 1 Architecture (15 min)
Define three to five Board-level outcome metrics for Phase 3. For each: what is the metric, what is the current baseline, what is the target, over what timeframe, and how will it be measured? Each metric should be a genuine outcome indicator: the result you're trying to achieve, not a progress indicator. Write one sentence per metric explaining the causal connection between Phase 3 implementation success and the metric moving in the target direction.

Step 3, Level 2 Architecture (15 min)
For each Level 1 metric, identify two to three Level 2 leading indicators: the organizational conditions or leadership behaviors that must be present for the Level 1 outcome to be achieved. These should be measurable monthly, owned by a specific leader, and causally connected to the Level 1 outcome. The test: if Level 2 metrics are green for six consecutive months, do you have high confidence that the Level 1 metric will achieve its target? If not, you haven't identified the right Level 2 indicators.

Step 4, Level 3 Architecture and Governance (15 min)
Design your Level 3 operational measurement system: what weekly indicators will tell you whether execution is on track? Who owns each indicator? How does the Level 3 data surface to Level 2 leadership: what is the aggregation and escalation process? Then design your performance governance: what meeting structure reviews which metrics at what frequency, who attends, what decision authority is in the room, and what is the protocol for escalating when a metric indicates a problem?`
          },
          {
            id: "3.4", title: "Compliance Layer", duration: "60 min", type: "framework",
            content: `Compliance in federal contracting and enterprise contexts is not a constraint on organizational strategy; it is a structural component of it. Organizations that treat compliance as an external requirement to be managed separately from their core operations consistently underperform those that have integrated compliance architecture into their operational and governance systems.

The compliance landscape relevant to Human OS™ engagements has three primary domains.

Federal Contractor Compliance covers the regulatory requirements that apply to organizations doing business with the federal government. CMMC 2.0 (Cybersecurity Maturity Model Certification) applies to any DoD contractor handling Controlled Unclassified Information and has three certification levels with specific security practice requirements. DFARS 252.204-7021 requires self-attestation of CMMC compliance and will require third-party certification for Level 2 contracts. SAM.gov registration maintenance, entity validation, and exclusion screening are baseline requirements for all federal contractors. SBA program requirements for set-aside certifications (SDVOSB, 8(a), HUBZone, WOSB) include eligibility maintenance, annual certification, and compliance with program participation requirements.

Human Capital Compliance covers the employment and workforce regulations that intersect with organizational transformation: EEO and affirmative action requirements, OFCCP compliance for federal contractors, FLSA classification requirements that become relevant during organizational restructuring, and union considerations where applicable.

AI and Data Governance Compliance is the emerging regulatory domain most relevant to organizations implementing AI integration architecture. Federal agencies are increasingly including AI governance requirements in solicitations and contracts. OMB Circular A-130 and agency-specific AI policies establish requirements for AI system transparency, accountability, and human oversight. NIST AI Risk Management Framework provides the voluntary but increasingly referenced standard for AI governance in federal contexts. State-level AI regulations (Colorado, Illinois, New York City, and others) apply to specific AI uses including hiring, performance management, and customer interaction.`,
            exercise: `This exercise produces a compliance architecture assessment and a gap remediation plan.

Step 1, Compliance Landscape Mapping (20 min)
Identify which compliance domains are relevant to your current operations and your Phase 3 target state. For each relevant domain: current compliance status (fully compliant, substantially compliant, partially compliant, non-compliant), the specific gaps in your current compliance posture, and the timeline and consequences of non-compliance if the gaps are not addressed.

Step 2, CMMC and Federal Contractor Compliance Assessment (15 min)
If you have or are pursuing federal contracts: (a) What CMMC level is required for your current or target contract portfolio? (b) What is your current score against the NIST SP 800-171 security practices that underlie CMMC Level 2? (c) Have you completed a System Security Plan? (d) What is your current SAM.gov registration status and when does it expire? (e) For set-aside certifications: is each certification current, what are the next renewal dates, and are you maintaining eligibility documentation? For each gap: specific remediation action, owner, and timeline.

Step 3, AI Governance Compliance Architecture (15 min)
Map your AI governance framework from Module 2.3 against the relevant compliance requirements. For each compliance requirement that applies to your AI use cases: does your current governance framework satisfy the requirement? If not, what specifically needs to be added, documented, or changed? Pay particular attention to the authentication and audit infrastructure requirements, federal AI governance requirements consistently emphasize human oversight and audit trail documentation.

Step 4, Integrated Compliance Calendar (10 min)
Build a 12-month compliance calendar for your organization. Include: all certification renewal dates and required documentation, all compliance self-attestation deadlines, all regulatory reporting requirements, scheduled internal compliance audits, and any pending regulatory changes that require preparation. Assign an owner for each item. The calendar should be a living document managed by a specific person, not a one-time exercise.`
          },
          {
            id: "3.5", title: "Graduation Checkpoint", duration: "90 min", type: "graduation",
            content: `Human OS™ Graduation is the highest authentication threshold in the M2M stack. The standard is not just that the work is complete; it is that the work is board-ready, implementation-ready, and politically real. Every deliverable in this submission will be reviewed against one question: could this be handed to the most demanding senior stakeholder in your system tomorrow, and would it answer their most important questions with sufficient honesty and specificity to earn their confidence?

Kevin reviews every Human OS™ Graduation personally. The review takes longer than PIVOT or BRIDGE Graduation reviews because the material is more complex, the stakes are higher, and the standard is stricter. Expect written feedback within five business days.

The most common reason Human OS™ Graduation Checkpoints are returned: the compliance layer is incomplete, either because the GovCon compliance assessment wasn't done with sufficient specificity, or because the AI governance compliance section is handled at a conceptual rather than operational level. At Human OS™ altitude, "we plan to address compliance" is not an acceptable answer. The compliance posture must be documented at the certification level, gap level, and remediation plan level.

After Graduation, Kevin provides specific next-step guidance. For organizations continuing to Phase 4 work (board presentation, executive coaching, GovCon BD support, enterprise partnership development), Graduation is the entry point. For organizations completing Human OS™ as a self-directed program, the Graduation package is your operational toolkit for the next 18 months.`,
            exercise: `Human OS™ Graduation requires six components. Each must meet board-ready specificity standards.

Component 1, Implementation Sequence
Your critical path with all dependencies mapped, your early win architecture with specific delivery plans for three early wins, and your 90-day and 6-month milestones for Phase 3. Must be specific enough to assign work and track progress without additional clarification.

Component 2, Stakeholder Activation Plan
Your enterprise stakeholder map, your activation diagnosis for three priority stakeholders, your engagement designs, and your follow-through protocols. Include your honest assessment of the stakeholder most likely to be the decisive constraint on Phase 3 success and your specific plan for addressing that constraint.

Component 3, Performance Architecture
Your three-level metric stack (Board, Leadership, Operational) with baselines, targets, timelines, owners, and measurement methods. Your performance governance structure including meeting cadence, decision authority, and escalation protocol.

Component 4, Compliance Architecture
Your compliance landscape map with current posture by domain, your CMMC and federal contractor compliance assessment with gap remediation plan, your AI governance compliance analysis, and your 12-month compliance calendar with owners.

Component 5, Board Brief
A two-to-three page board-ready brief: what we diagnosed (systemic challenge and root cause), what we designed (architecture decisions made in Phase 2 and their strategic rationale), what Phase 3 requires (resource commitments, decision authority, leadership behavior change from the board or senior leadership), what success looks like at 18 months (specific outcomes), and the most significant risk to the plan and how it's being managed. Written to the most demanding person in your governance structure.

Component 6, The Sovereign Commitment
One page, written by you personally, not edited for polish. What are you personally committing to change in your leadership behavior as a result of this process? What did Phase 1 and Phase 2 reveal about your own patterns that Phase 3 requires you to address? What is the single most important thing you know now that you didn't know when you began? This page is not for external review; it is for the Graduation record. It is the evidence that the work was done at the level of genuine examination rather than professional performance.`
          },
        ]
      }
    ]
  }
};

// ─── CHATBOT COMPONENT ─────────────────────────────────────────────────────────
function Chatbot({ platform, clientName, clientIntake, currentModule, moduleTitle, isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [openingLoading, setOpeningLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const platformData = PLATFORMS[platform];

  // Gap 2: Generate sovereign opening using intake data
  useEffect(() => {
    if (!isOpen || initialized || !platformData) return;
    setInitialized(true);

    const hasIntake = clientIntake && (clientIntake.situation || clientIntake.q1 || clientIntake.q2);

    if (!hasIntake) {
      // Fallback: no intake data available — use direct opening
      const fallback = `${clientName ? `${clientName} — ` : ""}you're in Module ${currentModule}, ${moduleTitle}. What are you working through right now?`;
      setMessages([{ role: "assistant", content: fallback, id: Date.now() }]);
      return;
    }

    // Generate sovereign opening via Claude using intake data
    setOpeningLoading(true);
    const openingPrompt = `You are the ${platformData.chatPersona} for M2M~Inc.

The person opening this chat right now is ${clientName || "a client"}. They are in Module ${currentModule}: ${moduleTitle}.

Here is what they told us when they submitted their intake form:
- Situation: ${clientIntake.situation || "not provided"}
- Q1 (What would you build even if no one paid you): ${clientIntake.q1 || "not provided"}
- Q2 (What do people keep calling you for): ${clientIntake.q2 || "not provided"}
- Q3 (What problem makes you angry nobody's solving): ${clientIntake.q3 || "not provided"}
- Q4 (Where does expertise meet market demand): ${clientIntake.q4 || "not provided"}
- Urgency score: ${clientIntake.urgency || 5}/10

Write ONE opening statement — 2-4 sentences maximum. Rules:
- Start with a declarative statement about what this person is actually facing. Name the real situation, not the surface situation.
- Do NOT ask a question as your first sentence.
- Do NOT use "I can see" or "I notice" or "It sounds like."
- Do NOT be generic. Reference something specific from their intake.
- If urgency is 8+ open with more directness. If 4 or below open with more curiosity.
- End with ONE focused question that opens genuine exploration.
- No em dashes. No AI vocabulary.
- Register: sovereign, earned, warm, specific.`;

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 200,
        messages: [{ role: "user", content: openingPrompt }],
      }),
    })
      .then(r => r.json())
      .then(data => {
        const opening = data.content?.[0]?.text || `${clientName ? `${clientName} — ` : ""}you're in Module ${currentModule}. What are you working through right now?`;
        setMessages([{ role: "assistant", content: opening, id: Date.now() }]);
      })
      .catch(() => {
        setMessages([{ role: "assistant", content: `${clientName ? `${clientName} — ` : ""}you're in Module ${currentModule}, ${moduleTitle}. What are you working through right now?`, id: Date.now() }]);
      })
      .finally(() => setOpeningLoading(false));
  }, [isOpen, initialized, clientName, clientIntake, currentModule, moduleTitle, platformData]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");

    const userMsg = { role: "user", content: text, id: Date.now() };
    const assistantId = Date.now() + 1;

    setMessages(prev => [...prev, userMsg, { role: "assistant", content: "", id: assistantId, streaming: true }]);
    setStreaming(true);

    const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
    const sysPrompt = platformData.systemPrompt(clientName, `${currentModule}, ${moduleTitle}`, "");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: sysPrompt,
          messages: history,
          stream: true,
        }),
        signal: (abortRef.current = new AbortController()).signal,
      });

      if (!response.ok) throw new Error(`API ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(l => l.startsWith("data:"));
        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(5));
            if (data.type === "content_block_delta" && data.delta?.text) {
              full += data.delta.text;
              setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: full } : m));
            }
          } catch {}
        }
      }

      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, streaming: false } : m));
    } catch (err) {
      if (err.name !== "AbortError") {
        setMessages(prev => prev.map(m => m.id === assistantId
          ? { ...m, content: "Connection interrupted. The intelligence layer is still active, try again.", streaming: false, error: true }
          : m));
      }
    } finally {
      setStreaming(false);
    }
  }, [input, streaming, messages, platform, clientName, currentModule, moduleTitle, platformData]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(10,18,35,0.85)",
      display: "flex", alignItems: "flex-end", justifyContent: "flex-end",
      padding: "0 24px 24px", zIndex: 1000,
    }}>
      <div style={{
        width: 420, height: "85vh", maxHeight: 720,
        background: T.navy, borderRadius: 16,
        border: `1px solid ${T.border}`,
        display: "flex", flexDirection: "column",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
      }}>
        {/* Chat header — Trust Gate visible */}
        <div style={{
          padding: "14px 18px", borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", animation: "pulse 2s infinite" }} />
              <span style={{ color: T.gold, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
                {platformData?.chatPersona}
              </span>
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 }}>
              Module {currentModule} · Real-time intelligence
            </div>
          </div>
          {/* Trust Gate badge — Gap 5 */}
          <div style={{
            background: "rgba(201,168,76,0.12)", border: `1px solid rgba(201,168,76,0.4)`,
            borderRadius: 6, padding: "4px 8px", marginRight: 8,
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <span style={{ fontSize: 10, color: T.gold }}>⚖</span>
            <span style={{ fontSize: 9, color: T.gold, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>Trust Gate Active</span>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.05)", border: `1px solid ${T.border}`,
            borderRadius: 8, color: T.muted, fontSize: 18, cursor: "pointer",
            width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
          {openingLoading && messages.length === 0 && (
            <div style={{ display: "flex", gap: 6, alignItems: "center", color: T.muted, fontSize: 12, padding: "8px 0" }}>
              <div style={{ display: "flex", gap: 3 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: T.gold, opacity: 0.6, animation: `bounce 1.2s ${i*0.2}s infinite` }} />
                ))}
              </div>
              <span>Sovereign intelligence initializing…</span>
            </div>
          )}
          {messages.map(m => (
            <div key={m.id} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "88%", padding: "10px 14px", borderRadius: 12, fontSize: 13,
                lineHeight: 1.65, whiteSpace: "pre-wrap", wordBreak: "break-word",
                background: m.role === "user"
                  ? `rgba(201,168,76,0.15)`
                  : m.error ? "rgba(220,53,69,0.1)" : "rgba(255,255,255,0.05)",
                border: m.role === "user"
                  ? `1px solid rgba(201,168,76,0.35)`
                  : m.error ? "1px solid rgba(220,53,69,0.2)" : "1px solid rgba(255,255,255,0.07)",
                color: m.error ? "#ff8888" : T.white,
              }}>
                {m.content}
                {m.streaming && (
                  <span style={{ display: "inline-block", width: 2, height: 14, background: T.gold, marginLeft: 3, verticalAlign: "text-bottom", animation: "blink 1s infinite" }} />
                )}
              </div>
            </div>
          ))}
          {streaming && messages[messages.length - 1]?.role !== "assistant" && (
            <div style={{ display: "flex", gap: 6, alignItems: "center", color: T.muted, fontSize: 12 }}>
              <div style={{ display: "flex", gap: 3 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: T.gold, opacity: 0.6, animation: `bounce 1.2s ${i*0.2}s infinite` }} />
                ))}
              </div>
              <span>Intelligence layer responding…</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }}}
              placeholder="Ask the guide anything about this module…"
              disabled={streaming || openingLoading}
              style={{
                flex: 1, background: "rgba(255,255,255,0.05)",
                border: `1px solid ${T.border}`, borderRadius: 8,
                padding: "9px 12px", color: T.white, fontSize: 13,
                outline: "none", fontFamily: "inherit",
                opacity: (streaming || openingLoading) ? 0.5 : 1,
              }}
            />
            <button
              onClick={send}
              disabled={streaming || openingLoading || !input.trim()}
              style={{
                background: (streaming || openingLoading || !input.trim()) ? "rgba(201,168,76,0.2)" : T.gold,
                border: "none", borderRadius: 8, padding: "9px 14px",
                color: (streaming || openingLoading || !input.trim()) ? T.goldDim : T.navy,
                fontWeight: 800, cursor: (streaming || openingLoading || !input.trim()) ? "not-allowed" : "pointer",
                fontSize: 15, transition: "all 0.15s",
              }}
            >→</button>
          </div>
          {/* Trust Gate footnote — context for checkpoint modules */}
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 7, textAlign: "center" }}>
            FL/II Doctrine · Sovereign Architect review before distribution
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
      `}</style>
    </div>
  );
}

// ─── MODULE CARD ───────────────────────────────────────────────────────────────
function ModuleCard({ mod, phaseIndex, onOpen, isActive, isCompleted }) {
  const typeColors = {
    reflection: { bg: "rgba(201,168,76,0.1)", text: T.gold, label: "Reflection" },
    framework:  { bg: "rgba(42,79,143,0.2)", text: "#7ba8e8", label: "Framework" },
    assessment: { bg: "rgba(45,122,74,0.15)", text: "#5abe7f", label: "Assessment" },
    build:      { bg: "rgba(201,168,76,0.12)", text: T.goldLight, label: "Build" },
    checkpoint: { bg: "rgba(220,53,69,0.1)", text: "#ff8888", label: "Checkpoint" },
    graduation: { bg: "rgba(201,168,76,0.2)", text: T.gold, label: "Graduation" },
  };
  const tc = typeColors[mod.type] || typeColors.framework;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      aria-label={`Open module ${mod.id}: ${mod.title}${isCompleted ? " (complete)" : ""}`}
      onClick={() => onOpen(mod)}
      onKeyDown={(ev) => {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); onOpen(mod); }
      }}
      style={{
        background: isActive ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isActive ? T.border : "rgba(255,255,255,0.06)"}`,
        borderRadius: 10, padding: "14px 16px", cursor: "pointer",
        transition: "all 0.2s",
        borderLeft: isCompleted ? `3px solid ${T.success}` : isActive ? `3px solid ${T.gold}` : "3px solid transparent",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <span style={{ color: T.goldDim, fontSize: 11, fontWeight: 700 }}>MODULE {mod.id}</span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: tc.bg, color: tc.text }}>
              {tc.label}
            </span>
            {isCompleted && <span style={{ fontSize: 10, color: T.success }}>✓ Complete</span>}
          </div>
          <div style={{ color: T.white, fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{mod.title}</div>
          <div style={{ color: T.muted, fontSize: 12 }}>{mod.duration}</div>
        </div>
        <div style={{ color: T.muted, fontSize: 18, marginLeft: 8, marginTop: 2 }}>›</div>
      </div>
    </div>
  );
}

// ─── MODULE DETAIL VIEW ────────────────────────────────────────────────────────
function ModuleDetail({ mod, platform, clientName, clientId, userId, userEmail, isFocusMode, onClose, onChat, onComplete, isCompleted }) {
  const platformData = PLATFORMS[platform];
  const isCheckpoint = mod.type === "checkpoint" || mod.type === "graduation";

  // Gap 4: Checkpoint submission state
  const [submissionText, setSubmissionText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://jnmywpfdykuybrxkdcmc.supabase.co";
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpubXl3cGZkeWt1eWJyeGtka21jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2OTEyMjUsImV4cCI6MjA2MTI2NzIyNX0.w25RCfcHLnYaXTVJQOEJoFoLxlAkDRMFCLEaSBDl3V0";

  const handleCheckpointSubmit = async () => {
    if (!submissionText.trim()) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      // Write to m2m_checkpoints
      const checkpointRes = await fetch(`${SUPABASE_URL}/rest/v1/m2m_checkpoints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          user_id: userId || null,
          email: userEmail || null,
          client_token: clientId || userId || "anonymous",
          client_name: clientName || userEmail || "Client",
          platform: platform,
          os_lane: platform,
          checkpoint_id: mod.id,
          module_title: mod.title,
          submission_text: submissionText.trim(),
          submission: submissionText.trim(),
          submitted_at: new Date().toISOString(),
          status: "PENDING_REVIEW",
        }),
      });

      if (!checkpointRes.ok) throw new Error("Supabase write failed");

      // ntfy alert to Kev
      await fetch("https://ntfy.sh/m2m-checkpoints-kt1010", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          "Title": `[CHECKPOINT] ${clientName || "Client"} — ${mod.title}`,
          "Priority": "high",
          "Tags": "memo,checkpoint",
        },
        body: `${clientName || "Client"} submitted ${platform} Module ${mod.id}: ${mod.title}. Review in Supabase m2m_checkpoints.`,
      }).catch(() => {}); // ntfy failure non-blocking

      // Write to audit log
      await fetch(`${SUPABASE_URL}/rest/v1/m2m_audit_log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          action: "CHECKPOINT_SUBMITTED",
          os_lane: platform,
          gate_result: "PENDING_REVIEW",
          route_taken: "CLIENT_PORTAL",
          scenario_name: "M2M Client Portal",
          kev_authenticated: "false",
        }),
      }).catch(() => {});

      setSubmitted(true);
      onComplete(); // mark module complete in progress state

    } catch (err) {
      setSubmitError("Submission failed. Your work is saved in this window — copy it and try again, or reach out directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-fm-scroll style={{ height: "100%", display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "24px 28px 0" }}>
        <button
          onClick={onClose}
          aria-expanded={isFocusMode ? true : undefined}
          aria-controls="fm-panel"
          aria-label="Back to modules — close focus view"
          style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 13, padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}
        >
          ← Back to modules
        </button>
        <div style={{ color: T.gold, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
          {platformData?.name} · Module {mod.id}
        </div>
        <h2 style={{ color: T.white, fontSize: 22, fontWeight: 700, margin: "0 0 6px", lineHeight: 1.3 }}>{mod.title}</h2>
        <div style={{ color: T.muted, fontSize: 13, marginBottom: 24 }}>{mod.duration} · {mod.type}</div>

        {/* Trust Gate notice on checkpoint modules — Gap 5 reinforcement */}
        {isCheckpoint && (
          <div style={{
            background: "rgba(201,168,76,0.06)", border: `1px solid rgba(201,168,76,0.3)`,
            borderRadius: 8, padding: "12px 16px", marginBottom: 20,
            display: "flex", alignItems: "flex-start", gap: 10,
          }}>
            <span style={{ color: T.gold, fontSize: 14, marginTop: 1 }}>⚖</span>
            <div>
              <div style={{ color: T.gold, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>
                Sovereign Architect Review
              </div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 1.5 }}>
                Kevin reviews every {mod.type} personally. Submitting this checkpoint initiates that review. You will receive written feedback before advancing.
              </div>
            </div>
          </div>
        )}

        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
          <ModuleContentRenderer text={mod.content} variant="content" />
        </div>

        <div style={{
          background: "rgba(201,168,76,0.08)", border: `1px solid ${T.border}`,
          borderRadius: 10, padding: "18px 20px", marginBottom: 28,
        }}>
          <div style={{ color: T.gold, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
            Module Exercise
          </div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.7 }}>
            <ModuleContentRenderer text={mod.exercise} variant="exercise" />
          </div>
        </div>

        {/* Gap 4: Checkpoint submission area */}
        {isCheckpoint && !isCompleted && (
          <div style={{
            background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`,
            borderRadius: 10, padding: "20px 22px", marginBottom: 24,
          }}>
            <div style={{ color: T.white, fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
              Submit Your {mod.type === "graduation" ? "Graduation" : "Checkpoint"} Work
            </div>
            <div style={{ color: T.muted, fontSize: 12, marginBottom: 14, lineHeight: 1.5 }}>
              Paste or write your responses to the exercise above. Kevin will review and provide written feedback within 48 hours.
            </div>
            {submitted ? (
              <div style={{
                background: "rgba(45,122,74,0.15)", border: "1px solid rgba(45,122,74,0.4)",
                borderRadius: 8, padding: "16px 18px",
                display: "flex", alignItems: "flex-start", gap: 10,
              }}>
                <span style={{ fontSize: 18, marginTop: 1 }}>✓</span>
                <div>
                  <div style={{ color: "#5abe7f", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                    Submitted. Kevin will review within 48 hours.
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 1.5 }}>
                    Your work is logged and this module is marked complete. Written feedback will come directly from Kevin. If you need to add anything, reply to that message.
                  </div>
                </div>
              </div>
            ) : (
              <>
                <textarea
                  value={submissionText}
                  onChange={e => setSubmissionText(e.target.value)}
                  placeholder={`Write your ${mod.type === "graduation" ? "graduation" : "checkpoint"} responses here. Be specific — this is the work that earns the feedback.`}
                  rows={8}
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${T.border}`, borderRadius: 8,
                    padding: "12px 14px", color: T.white, fontSize: 13,
                    lineHeight: 1.65, outline: "none", fontFamily: "inherit",
                    resize: "vertical", boxSizing: "border-box",
                  }}
                />
                {submitError && (
                  <div style={{ color: "#ff8888", fontSize: 12, marginTop: 8 }}>{submitError}</div>
                )}
                <button
                  onClick={handleCheckpointSubmit}
                  disabled={submitting || !submissionText.trim()}
                  style={{
                    marginTop: 12, background: submitting || !submissionText.trim() ? "rgba(201,168,76,0.2)" : T.gold,
                    border: "none", borderRadius: 8, padding: "11px 22px",
                    color: submitting || !submissionText.trim() ? T.goldDim : T.navy,
                    fontSize: 13, fontWeight: 700,
                    cursor: submitting || !submissionText.trim() ? "not-allowed" : "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {submitting ? "Submitting…" : `Submit ${mod.type === "graduation" ? "Graduation" : "Checkpoint"} →`}
                </button>
              </>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingBottom: 28 }}>
          <button
            onClick={onChat}
            style={{
              background: T.gold, border: "none", borderRadius: 8, padding: "11px 20px",
              color: T.navy, fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}
          >
            Ask the Guide →
          </button>
          {!isCheckpoint && !isCompleted && (
            <button
              onClick={onComplete}
              style={{
                background: "rgba(45,122,74,0.15)", border: "1px solid rgba(45,122,74,0.3)",
                borderRadius: 8, padding: "11px 20px",
                color: "#5abe7f", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              Mark Complete
            </button>
          )}
          {isCompleted && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.success, fontSize: 13, fontWeight: 600 }}>
              ✓ Completed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── URL PARAM READER ──────────────────────────────────────────────────────────
function getUrlParams() {
  try {
    const params = new URLSearchParams(window.location.search);
    const laneMap = {
      "PIVOT_OS": "PIVOT_OS", "pivot_os": "PIVOT_OS", "pivot": "PIVOT_OS",
      "BRIDGE_OS": "BRIDGE_OS", "bridge_os": "BRIDGE_OS", "bridge": "BRIDGE_OS",
      "HUMAN_OS": "HUMAN_OS", "human_os": "HUMAN_OS", "human": "HUMAN_OS",
    };
    return {
      name: params.get("name") || "",
      lane: laneMap[params.get("lane")] || "PIVOT_OS",
      urgency: parseInt(params.get("urgency") || "5", 10),
      situation: params.get("situation") || "",
      q1: params.get("q1") || "",
      q2: params.get("q2") || "",
      q3: params.get("q3") || "",
      q4: params.get("q4") || "",
    };
  } catch {
    return { name: "", lane: "PIVOT_OS", urgency: 5, situation: "", q1: "", q2: "", q3: "", q4: "" };
  }
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const { user, signOut } = useAuthUser();
  const userId = user?.id || null;
  const userEmail = user?.email || "";

  const e = getUrlParams();
  const [activeLane, setActiveLane] = useState(null);
  // Focus Mode: activeModuleId drives which module is open; isFocusMode toggles
  // the collapsed-rail / full-width expanded layout. The module object itself is
  // derived from activeModuleId below so there is a single source of truth.
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [completingId, setCompletingId] = useState(null); // module mid gold-check animation
  const [liveMessage, setLiveMessage] = useState("");      // aria-live announcements
  const [chatOpen, setChatOpen] = useState(null);
  const [completedModules, setCompletedModules] = useState({});
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [clientName, setClientName] = useState("");
  const [intakeData, setIntakeData] = useState({});
  const [initialized, setInitialized] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Refs: phase headings (for scroll-to-next-phase on phase completion), the
  // focus panel (scroll reset + focus trap), and the element that opened focus
  // mode (to restore focus on exit). touchRef tracks swipe gestures on mobile.
  const phaseRefs = useRef({});
  const focusPanelRef = useRef(null);
  const lastTriggerRef = useRef(null);
  const touchRef = useRef({ x: 0, y: 0 });

  // URL params still hydrate the portal when present. If the URL declared no
  // ?lane=, we leave the door open for the progress-load effect to restore the
  // user's last saved lane from Supabase.
  const urlHasLane = (() => {
    try { return new URLSearchParams(window.location.search).has("lane"); }
    catch { return false; }
  })();

  useLayoutEffect(() => {
    const params = getUrlParams();
    setActiveLane(params.lane);
    setClientName(params.name || (userEmail ? userEmail.split("@")[0] : ""));
    setIntakeData(params);
    setInitialized(true);
  }, [userEmail]);

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://jnmywpfdykuybrxkdcmc.supabase.co";
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpubXl3cGZkeWt1eWJyeGtka21jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2OTEyMjUsImV4cCI6MjA2MTI2NzIyNX0.w25RCfcHLnYaXTVJQOEJoFoLxlAkDRMFCLEaSBDl3V0";

  // Legacy client_token kept for back-compat with rows written before auth.
  // Primary identity is now the Supabase auth user_id.
  const legacyClientToken = clientName
    ? `${clientName.toLowerCase().replace(/\s+/g, "-")}-${(activeLane || "pivot_os").toLowerCase()}`
    : null;

  // Load existing progress for the signed-in user. Also restore last-saved lane
  // when the URL didn't specify one (returning-user flow).
  useEffect(() => {
    if (!userId) { setProgressLoaded(true); return; }
    fetch(
      `${SUPABASE_URL}/rest/v1/m2m_module_progress?user_id=eq.${userId}` +
      `&select=platform,module_id,completed,completed_at&order=completed_at.desc.nullslast`,
      {
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    )
      .then(r => r.json())
      .then(rows => {
        if (Array.isArray(rows) && rows.length > 0) {
          const rebuilt = {};
          rows.forEach(row => {
            if (row.completed) rebuilt[`${row.platform}-${row.module_id}`] = true;
          });
          setCompletedModules(rebuilt);

          if (!urlHasLane) {
            const lastPlatform = rows.find(r => r.platform && PLATFORMS[r.platform])?.platform;
            if (lastPlatform) setActiveLane(lastPlatform);
          }
        }
      })
      .catch(() => {})
      .finally(() => setProgressLoaded(true));
  }, [userId]);

  // Restore focus position on reload. The profile row records the user's
  // current_module / current_phase / os_lane (written on every completion). If
  // the saved module still exists in the lane, drop the user back into focus
  // mode exactly where they left off.
  useEffect(() => {
    if (!userId) return;
    fetch(
      `${SUPABASE_URL}/rest/v1/m2m_client_profiles?id=eq.${userId}` +
      `&select=os_lane,current_phase,current_module`,
      {
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    )
      .then(r => r.json())
      .then(rows => {
        const prof = Array.isArray(rows) ? rows[0] : null;
        if (!prof) return;
        const targetLane = (prof.os_lane && PLATFORMS[prof.os_lane]) ? prof.os_lane : null;
        if (!urlHasLane && targetLane) setActiveLane(targetLane);
        const laneForCheck = targetLane || activeLane || "PIVOT_OS";
        const exists = !!prof.current_module && PLATFORMS[laneForCheck]?.phases
          .some(p => p.modules.some(m => m.id === prof.current_module));
        if (exists) {
          setActiveModuleId(prof.current_module);
          setIsFocusMode(true);
        }
      })
      .catch(() => {});
  }, [userId]);

  // ─── FOCUS MODE CONTROLS ──────────────────────────────────────────────────
  // Defined above the early `!initialized` return so the hooks below run on
  // every render (Rules of Hooks). These touch only state setters and refs.

  // Enter focus mode on a module. Remembers the trigger element for focus return.
  const openModule = (mod) => {
    if (typeof document !== "undefined") lastTriggerRef.current = document.activeElement;
    setActiveModuleId(mod.id);
    setIsFocusMode(true);
    setLiveMessage(`Opened module ${mod.id}: ${mod.title}.`);
  };

  // Exit focus mode: collapse back to the full module list and restore focus.
  const exitFocus = () => {
    setIsFocusMode(false);
    setActiveModuleId(null);
    setCompletingId(null);
    const trigger = lastTriggerRef.current;
    if (trigger && typeof trigger.focus === "function") {
      requestAnimationFrame(() => trigger.focus());
    }
  };

  // Swipe-right on mobile closes focus mode (mirrors the Back button / Esc).
  const onTouchStart = (ev) => {
    const t = ev.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (ev) => {
    const t = ev.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    if (dx > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) exitFocus();
  };

  // Esc closes focus mode; Tab is trapped within the focus panel while open.
  useEffect(() => {
    if (!isFocusMode) return;
    const onKey = (ev) => {
      if (ev.key === "Escape") { ev.preventDefault(); exitFocus(); return; }
      if (ev.key === "Tab" && focusPanelRef.current) {
        const focusables = focusPanelRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
        else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isFocusMode]);

  // On opening / switching the focused module: reset scroll to the top of the
  // module content and move focus into the panel (completes the focus trap).
  useEffect(() => {
    if (!isFocusMode || !activeModuleId) return;
    const panel = focusPanelRef.current;
    if (!panel) return;
    panel.scrollTop = 0;
    const scroller = panel.querySelector("[data-fm-scroll]");
    if (scroller) scroller.scrollTop = 0;
    const firstBtn = panel.querySelector("button");
    if (firstBtn) firstBtn.focus();
  }, [activeModuleId, isFocusMode]);

  if (!initialized) {
    return (
      <div style={{ minHeight: '100vh', background: '#0B1F3A', display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ color: '#C9A84C', fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.4rem', fontWeight: 600, letterSpacing: '0.05em' }}>M2M~Inc.</div>
        <div style={{ color: '#6B7A99', fontSize: '0.85rem' }}>Initializing your portal...</div>
      </div>
    );
  }

  const platform = PLATFORMS[activeLane] || PLATFORMS.PIVOT_OS;
  const allModules = platform.phases.flatMap(p => p.modules);
  const completedCount = Object.values(completedModules).filter(Boolean).length;
  const totalCount = allModules.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  // Single source of truth: derive the open module object from activeModuleId.
  const activeModule = activeModuleId ? allModules.find(m => m.id === activeModuleId) || null : null;

  // Resolve the next module after `modId`. samePhase=true when the next module
  // lives in the same phase (auto-advance, stay in focus); samePhase=false when
  // the next module is the first of the following phase (exit focus, scroll list).
  const getNextModule = (modId) => {
    for (let pi = 0; pi < platform.phases.length; pi++) {
      const ph = platform.phases[pi];
      const mi = ph.modules.findIndex(m => m.id === modId);
      if (mi !== -1) {
        if (mi + 1 < ph.modules.length) return { mod: ph.modules[mi + 1], phase: ph, samePhase: true };
        const nph = platform.phases[pi + 1];
        if (nph && nph.modules.length) return { mod: nph.modules[0], phase: nph, samePhase: false };
        return null; // final module in the curriculum
      }
    }
    return null;
  };

  const findPhaseOf = (modId) =>
    platform.phases.find(ph => ph.modules.some(m => m.id === modId)) || null;

  // Best-effort persistence: upsert the completion row and update the profile
  // pointer. Network failures are swallowed — the optimistic local state already
  // reflects completion and the UI must not stall on Supabase.
  const persistCompletion = async (modId) => {
    if (!userId) return;
    const entry = allModules.find(m => m.id === modId);
    const next = getNextModule(modId);
    const nextModId = next ? next.mod.id : modId;
    const nextPhase = next ? next.phase.id : (findPhaseOf(modId)?.id ?? null);
    const nowIso = new Date().toISOString();

    try {
      await fetch(`${SUPABASE_URL}/rest/v1/m2m_module_progress?on_conflict=user_id,os_lane,module_id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Prefer": "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify({
          user_id: userId,
          client_id: userId,
          email: userEmail,
          client_token: legacyClientToken || userId,
          client_name: clientName || userEmail || "Client",
          platform: activeLane,
          os_lane: activeLane,
          module_id: modId,
          module_title: entry?.title || null,
          completed: true,
          completed_at: nowIso,
          status: "completed",
        }),
      });
    } catch {}

    try {
      await fetch(`${SUPABASE_URL}/rest/v1/m2m_client_profiles?id=eq.${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          current_module: nextModId,
          current_phase: nextPhase,
          updated_at: nowIso,
        }),
      });
    } catch {}
  };

  // Advance after the gold-check animation: next module in-phase stays in focus;
  // last-in-phase exits focus and scrolls the list to the next phase.
  const advanceFrom = (modId) => {
    const next = getNextModule(modId);
    if (next && next.samePhase) {
      setActiveModuleId(next.mod.id); // stay in focus mode
      setLiveMessage(`Module complete. Advancing to module ${next.mod.id}: ${next.mod.title}.`);
    } else if (next) {
      exitFocus();
      setLiveMessage(`Phase complete. Continue with Phase ${next.phase.id}: ${next.phase.name}.`);
      requestAnimationFrame(() => {
        const el = phaseRefs.current[next.phase.id];
        if (el && typeof el.scrollIntoView === "function") {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    } else {
      exitFocus();
      setLiveMessage("Final module complete. You've finished the curriculum.");
    }
  };

  // handleComplete: optimistic local state → fire persistence → show the 400ms
  // gold checkmark → advance. Keyed to the signed-in user via persistCompletion.
  const handleComplete = (modId) => {
    if (completingId) return; // guard against double-fire mid-animation
    setCompletedModules(prev => ({ ...prev, [`${activeLane}-${modId}`]: true }));
    setCompletingId(modId);
    void persistCompletion(modId);
    setTimeout(() => {
      setCompletingId(null);
      advanceFrom(modId);
    }, 400);
  };

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try { await signOut(); }
    catch {}
    finally { setSigningOut(false); }
  };

  const clientIntakeRef = intakeData;

  return (
    <div style={{
      minHeight: "100vh", background: T.ink,
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: T.white,
    }}>
      {/* Focus Mode layout + animations. Inline-style file, so the responsive
          breakpoint (md = 768px) and 300ms transition live in a scoped <style>. */}
      <style>{`
        .fm-shell { display: grid; gap: 20px; grid-template-columns: 1fr; transition: grid-template-columns 0.3s ease; }
        @media (min-width: 768px) { .fm-shell[data-focus="true"] { grid-template-columns: 64px 1fr; } }
        @media (max-width: 767px) { .fm-shell[data-focus="true"] .fm-rail { display: none; } }
        .fm-rail { transition: opacity 0.3s ease; }
        .fm-panel { animation: fmPanelIn 0.3s ease; }
        @keyframes fmPanelIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: none; } }
        .fm-check-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(15,37,69,0.82); border-radius: 14px; z-index: 5; animation: fmFade 0.4s ease; }
        .fm-check { width: 84px; height: 84px; border-radius: 50%; background: rgba(201,168,76,0.15); border: 2px solid ${T.gold}; color: ${T.gold}; font-size: 44px; display: flex; align-items: center; justify-content: center; animation: fmPop 0.4s cubic-bezier(.2,.8,.2,1); }
        @keyframes fmPop { 0% { transform: scale(0.4); opacity: 0; } 60% { transform: scale(1.12); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fmFade { from { opacity: 0; } to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .fm-shell, .fm-panel, .fm-check, .fm-check-overlay { transition: none; animation: none; } }
      `}</style>

      {/* Screen-reader announcements for completion / advance / phase changes. */}
      <div aria-live="polite" role="status" style={{
        position: "absolute", width: 1, height: 1, padding: 0, margin: -1,
        overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0,
      }}>{liveMessage}</div>

      {/* Top nav */}
      <div style={{
        background: T.navy, borderBottom: `1px solid ${T.border}`,
        padding: "0 24px", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ color: T.gold, fontSize: 16, fontWeight: 800, letterSpacing: 1 }}>M2M~Inc.</div>
            <div style={{ width: 1, height: 18, background: T.border }} />
            <div style={{ color: T.muted, fontSize: 12 }}>Client Portal</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ color: T.muted, fontSize: 12 }}>
              {clientName && <span>Welcome, <span style={{ color: T.gold }}>{clientName}</span></span>}
            </div>
            <button
              onClick={() => setChatOpen(true)}
              style={{
                background: T.gold, border: "none", borderRadius: 8,
                padding: "7px 14px", color: T.navy, fontSize: 12,
                fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <span style={{ fontSize: 14 }}>◎</span> Ask the Guide
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              title={userEmail ? `Signed in as ${userEmail}` : "Sign out"}
              style={{
                background: "transparent",
                border: "none",
                color: T.gold,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 0.3,
                cursor: signingOut ? "not-allowed" : "pointer",
                opacity: signingOut ? 0.5 : 0.85,
                padding: "4px 2px",
                textDecoration: "underline",
                textUnderlineOffset: 3,
                textDecorationColor: "rgba(201,168,76,0.4)",
              }}
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>

        {/* Platform selector */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
            Select Your Platform
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 12 }}>
            {Object.values(PLATFORMS).map(p => (
              <button
                key={p.id}
                onClick={() => { setActiveLane(p.id); exitFocus(); }}
                style={{
                  background: activeLane === p.id ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${activeLane === p.id ? T.border : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 12, padding: "16px 18px", cursor: "pointer", textAlign: "left",
                  transition: "all 0.2s",
                  outline: activeLane === p.id ? `2px solid ${T.gold}` : "none",
                  outlineOffset: -1,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 18, color: T.gold }}>{p.icon}</span>
                  <span style={{ color: T.gold, fontSize: 13, fontWeight: 700 }}>{p.name}</span>
                </div>
                <div style={{ color: T.white, fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{p.tagline}</div>
                <div style={{ color: T.muted, fontSize: 11 }}>{p.audience}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Platform header + progress */}
        <div style={{
          background: T.navy, borderRadius: 14, padding: "22px 24px",
          border: `1px solid ${T.border}`, marginBottom: 24,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginBottom: 16 }}>
            <div>
              <div style={{ color: T.gold, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>
                {platform.tagline}
              </div>
              <h1 style={{ color: T.white, fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>{platform.name}</h1>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, margin: 0, maxWidth: 580, lineHeight: 1.65 }}>
                {platform.intro}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: T.gold, fontSize: 28, fontWeight: 800 }}>{progressPct}%</div>
              <div style={{ color: T.muted, fontSize: 12 }}>{completedCount} of {totalCount} modules</div>
            </div>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%", background: T.gold, borderRadius: 2,
              width: `${progressPct}%`, transition: "width 0.4s ease",
            }} />
          </div>
        </div>

        {/* Content area — Focus Mode shell. Not focused: full module list.
            Focused: collapsed rail (64px icon strip md+, hidden mobile) + the
            full-width expanded module panel. */}
        <div className="fm-shell" data-focus={isFocusMode ? "true" : "false"}>

          {/* Module list rail */}
          <div className="fm-rail">
            {isFocusMode ? (
              /* Collapsed icon strip — phase numbers + per-module dots (md+ only;
                 hidden on mobile so the panel is full-width). */
              <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center", paddingTop: 4, position: "sticky", top: 76 }}>
                {platform.phases.map(phase => (
                  <div key={phase.id} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                    <div title={`Phase ${phase.id}: ${phase.name}`} style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: "rgba(201,168,76,0.15)", border: `1px solid ${T.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: T.gold, fontSize: 11, fontWeight: 800,
                    }}>{phase.id}</div>
                    {phase.modules.map(mod => {
                      const done = !!completedModules[`${activeLane}-${mod.id}`];
                      const active = activeModuleId === mod.id;
                      return (
                        <button
                          key={mod.id}
                          onClick={() => openModule(mod)}
                          title={`Module ${mod.id}: ${mod.title}`}
                          aria-label={`Module ${mod.id}: ${mod.title}${done ? " (complete)" : ""}`}
                          aria-current={active ? "true" : undefined}
                          style={{
                            width: 11, height: 11, borderRadius: "50%", padding: 0,
                            cursor: "pointer",
                            background: done ? T.success : active ? T.gold : "rgba(255,255,255,0.18)",
                            border: active ? `2px solid ${T.goldLight}` : "none",
                            outline: "none",
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {platform.phases.map((phase, pi) => (
                  <div
                    key={phase.id}
                    ref={el => { phaseRefs.current[phase.id] = el; }}
                    style={{ marginBottom: 24, scrollMarginTop: 76 }}
                  >
                    <div style={{
                      display: "flex", alignItems: "center", gap: 12, marginBottom: 12,
                      paddingBottom: 10, borderBottom: `1px solid rgba(255,255,255,0.06)`,
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: `rgba(201,168,76,0.15)`, border: `1px solid ${T.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: T.gold, fontSize: 12, fontWeight: 800,
                      }}>{phase.id}</div>
                      <div>
                        <div style={{ color: T.white, fontSize: 15, fontWeight: 700 }}>Phase {phase.id}: {phase.name}</div>
                        <div style={{ color: T.muted, fontSize: 12 }}>{phase.subtitle}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 8 }}>
                      {phase.modules.map(mod => (
                        <ModuleCard
                          key={mod.id}
                          mod={mod}
                          phaseIndex={pi}
                          onOpen={openModule}
                          isActive={activeModuleId === mod.id}
                          isCompleted={!!completedModules[`${activeLane}-${mod.id}`]}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expanded module panel (focus mode) */}
          {isFocusMode && activeModule && (
            <div
              ref={focusPanelRef}
              id="fm-panel"
              className="fm-panel"
              role="region"
              aria-label={`Module ${activeModule.id}: ${activeModule.title}`}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              style={{
                background: T.navy, borderRadius: 14,
                border: `1px solid ${T.border}`,
                position: "relative",
                maxHeight: "calc(100vh - 100px)", overflowY: "auto",
              }}
            >
              <ModuleDetail
                mod={activeModule}
                platform={activeLane}
                clientName={clientName}
                clientId={legacyClientToken || userId}
                userId={userId}
                userEmail={userEmail}
                isFocusMode={isFocusMode}
                onClose={exitFocus}
                onChat={() => setChatOpen(true)}
                onComplete={() => handleComplete(activeModule.id)}
                isCompleted={!!completedModules[`${activeLane}-${activeModule.id}`]}
              />
              {completingId === activeModule.id && (
                <div className="fm-check-overlay" aria-hidden="true">
                  <div className="fm-check">✓</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating chat button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          style={{
            position: "fixed", bottom: 28, right: 28,
            width: 56, height: 56, borderRadius: "50%",
            background: T.gold, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, boxShadow: "0 4px 24px rgba(201,168,76,0.4)",
            color: T.navy, fontWeight: 800,
            transition: "transform 0.2s",
            zIndex: 999,
          }}
          title="Ask the Guide"
        >◎</button>
      )}

      {/* Chatbot — single instance */}
      {chatOpen && (
        <Chatbot
          platform={activeLane}
          clientName={clientName}
          clientIntake={clientIntakeRef}
          currentModule={activeModule?.id || "1.1"}
          moduleTitle={activeModule?.title || platform.phases[0]?.modules[0]?.title}
          isOpen={!!chatOpen}
          onClose={() => setChatOpen(null)}
        />
      )}
    </div>
  );
}
