// BuLLMaps skill -> sub-skill -> step data for the Outputs-pane tracker (18 Nov 2026, per user).
// Names and grouping: her sub-skills spreadsheet, tab "BuLLMaps" (authoritative). Expected output and the
// human-approval gate per step: the adopted "Agent Workflow" tab of BuLLM - BuLLMaps Workflow v0.1, matched by
// step name (Website "Project Tracking Setup" matched via its output prefix; her "Video SEO" is the workflow
// tab's "YouTube SEO"; her grouped "Other Platforms" step shares the six platform rows' identical output).
export interface StepInfo { n: string; name: string; gated: boolean; output: string }
export interface SubSkillInfo { n: string; name: string; steps: StepInfo[] }

/** Skill names in nav order (the sheet's Skill column). */
export const SKILL_NAMES: Record<string, string> = {
  '0': 'Router / Concierge',
  '1': 'Audit & Strategy', '2': 'Website', '3': 'SEO (Organic, Local & AEO/GEO)', '4': 'Content & Creatives',
  '5': 'Paid Ads', '6': 'Social Media', '7': 'Brand', '8': 'MQL', '9': 'CRM', '10': 'Reports & Publishing',
}

export const SKILL_STEPS: Record<string, SubSkillInfo[]> = {
  // Skill 0 (Router / Concierge, 19 Nov 2026, per user): the intake in the middle-pane chat; its Outputs pane uses
  // the RFQ-style progress + output design (SkillSteps.tsx), not the step tracker. Steps, outputs and the approval
  // gate per step are her adopted Agent Workflow tab.
  '0': [
    { n: '0.1', name: 'Research, Extract, Audit & Analyze', steps: [
      { n: '0.1.1', name: 'Read voice/text request and identify intent and task(s)', gated: false, output: 'Structured request with task(s), language and intent' },
      { n: '0.1.2', name: 'Retrieve brand profile and relevant previous-cycle feedback', gated: false, output: 'Relevant brand context and feedback linked to request' },
      { n: '0.1.3', name: 'Collect missing business basics and clarify gaps', gated: false, output: 'Clarifying question and updated brief' },
    ] },
    { n: '0.2', name: 'Recommend, Strategize, Plan & Client Review', steps: [
      { n: '0.2.1', name: 'Select relevant skill(s) and map the task sequence', gated: false, output: 'Selected skill IDs and proposed task sequence' },
      { n: '0.2.2', name: 'Read back scope, expected output, audience and any budget', gated: false, output: 'Read-back awaiting client decision' },
      { n: '0.2.3', name: 'Record client approval, edit or cancel before proceeding', gated: true, output: 'Recorded approve/edit/cancel decision linked to plan' },
    ] },
    { n: '0.3', name: 'Create, Fix, Optimize & Schedule', steps: [
      { n: '0.3.1', name: 'Hand approved brief and brand context to selected skill(s)', gated: true, output: 'Versioned draft brief handed to selected skills' },
      { n: '0.3.2', name: 'Track task status and collect draft outputs / proposed schedules', gated: false, output: 'Current status with drafts, blockers and proposed times' },
      { n: '0.3.3', name: 'Prepare draft handoff for review; route gaps or changes back', gated: false, output: 'Review package or explicit routed revision request' },
    ] },
    { n: '0.4', name: 'Upload, Publish, Monitor & Report', steps: [
      { n: '0.4.1', name: 'Collect internal review and client approve / edit / cancel', gated: true, output: 'Recorded client approve/edit/cancel; rejected draft routed back' },
      { n: '0.4.2', name: 'Pass only approved live actions to relevant skill(s); verify result', gated: true, output: 'Verified result or explicit failure/unknown outcome' },
      { n: '0.4.3', name: 'Report completion or blockers and feed results into next intake', gated: false, output: 'Completion/blocker report and next-cycle feedback' },
    ] },
  ],
  '1': [
    { n: '1.1', name: 'Research, Extract, Audit & Analyze', steps: [
      { n: '1.1.1', name: 'Audit', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '1.1.2', name: 'Keyword', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '1.1.3', name: 'Competitor', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '1.1.4', name: 'Backlink', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '1.1.5', name: 'Citation', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '1.1.6', name: 'Lead Drivers', gated: false, output: 'sourced findings / structured research record (no live changes)' },
    ] },
    { n: '1.2', name: 'Recommend, Strategize, Plan & Client Review', steps: [
      { n: '1.2.1', name: 'LinkedIn Profile & Company Page Audit', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '1.2.2', name: 'GBP Audit', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '1.2.3', name: 'Website Audit', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '1.2.4', name: 'Brand Audit', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '1.2.5', name: 'LinkedIn Lead Form', gated: false, output: 'sourced findings / structured research record (no live changes)' },
    ] },
    { n: '1.3', name: 'Create, Fix, Optimize & Schedule', steps: [
      { n: '1.3.1', name: 'Business & Offer Discovery', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '1.3.2', name: 'Customer / ICP Research', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '1.3.3', name: 'Market Sizing & Opportunity', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '1.3.4', name: 'Channel Attribution Baseline', gated: false, output: 'sourced findings / structured research record (no live changes)' },
    ] },
    { n: '1.4', name: 'Upload, Publish, Monitor & Report', steps: [
      { n: '1.4.1', name: 'Blueprint', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '1.4.2', name: 'Recommendations', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '1.4.3', name: 'Marketing Strategy & Positioning', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '1.4.4', name: 'Budget & KPI Forecast', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '1.4.5', name: 'Plan', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '1.4.6', name: 'Plan/Roadmap', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '1.4.7', name: 'Content Calendar', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
    ] },
  ],
  '2': [
    { n: '2.1', name: 'Research, Extract, Audit & Analyze', steps: [
      { n: '2.1.1', name: 'Project Tracking Setup', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '2.1.2', name: 'Wireframes & Template Mapping', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '2.1.3', name: 'Page Inventory & Count', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '2.1.4', name: 'Site Structure', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '2.1.5', name: 'Technical Specification', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '2.1.6', name: 'UX', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '2.1.7', name: 'Accessibility (WCAG)', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '2.1.8', name: 'Mobile', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '2.1.9', name: 'Technical Crawl & Log Analysis', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '2.1.10', name: 'Hosting & WordPress Installation', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.1.11', name: 'Website Build', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.1.12', name: 'CMS Integration', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.1.13', name: 'CMS Integration & Deployment', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
    ] },
    { n: '2.2', name: 'Recommend, Strategize, Plan & Client Review', steps: [
      { n: '2.2.1', name: 'Page Build', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.2.2', name: 'Homepage', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.2.3', name: 'Inner Page', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.2.4', name: 'Service Page', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.2.5', name: 'Location Page', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.2.6', name: 'Knowledge Page', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.2.7', name: 'Landing Page', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.2.8', name: 'Programmatic Page', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.2.9', name: 'Blog Post Creation & Upload', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '2.2.10', name: 'Content Upload & Formatting', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '2.2.11', name: 'Image Sourcing & Optimization', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.2.12', name: 'Basic On-Page SEO', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.2.13', name: 'Schema', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
    ] },
    { n: '2.3', name: 'Create, Fix, Optimize & Schedule', steps: [
      { n: '2.3.1', name: 'Forms & Lead Routing', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.3.2', name: 'CTA & WhatsApp Integration', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.3.3', name: 'Conversion Rate Optimization', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.3.4', name: 'GA4 & Lead Conversion Tracking', gated: false, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '2.3.5', name: 'Caching & CDN Configuration', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.3.6', name: 'Speed', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.3.7', name: 'Roles & Access Control', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.3.8', name: 'Security', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.3.9', name: 'Security Plugin & Firewall Configuration', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.3.10', name: 'SSL & HTTPS Enforcement', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.3.11', name: 'Consent & Privacy Controls', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.3.12', name: 'Backup & Rollback', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.3.13', name: 'Backup Schedule & Restore Test', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
    ] },
    { n: '2.4', name: 'Upload, Publish, Monitor & Report', steps: [
      { n: '2.4.1', name: 'Domain & DNS Setup', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.4.2', name: 'Deployment', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '2.4.3', name: 'Content & Database Migration', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '2.4.4', name: 'Redirects & Migrations', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '2.4.5', name: 'Full-Site Functional QA', gated: false, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '2.4.6', name: 'Link & Redirect Validation', gated: false, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '2.4.7', name: 'Core Web Vitals Verification', gated: false, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '2.4.8', name: 'Uptime & Broken Link Monitoring', gated: false, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '2.4.9', name: 'Malware & Vulnerability Checks', gated: false, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '2.4.10', name: 'Launch Readiness & Go-Live', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '2.4.11', name: 'Post-Launch Verification & Monitoring', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '2.4.12', name: 'Tracking Verification', gated: false, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '2.4.13', name: 'GSC Fix', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '2.4.14', name: 'Page Indexing', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '2.4.15', name: 'Project Status & Closeout', gated: false, output: 'verified result/status + evidence; approved version only if live action is involved' },
    ] },
  ],
  '3': [
    { n: '3.1', name: 'Research, Extract, Audit & Analyze', steps: [
      { n: '3.1.1', name: 'Organic Rank Tracking', gated: false, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '3.1.2', name: 'Search Intent & Topic Clusters', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '3.1.3', name: 'Content Gap Analysis', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '3.1.4', name: 'On-page (Meta, OG, Headings)', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '3.1.5', name: 'Internal Links', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '3.1.6', name: 'Page Optimization', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '3.1.7', name: 'SEO Change Validation', gated: false, output: 'verified result/status + evidence; approved version only if live action is involved' },
    ] },
    { n: '3.2', name: 'Recommend, Strategize, Plan & Client Review', steps: [
      { n: '3.2.1', name: 'GBP Optimization', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '3.2.2', name: 'GBP Posts & Reviews', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '3.2.3', name: 'Local Rank Tracking', gated: false, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '3.2.4', name: 'Local Competitor Analysis', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '3.2.5', name: 'Service Area Analysis', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '3.2.6', name: 'Service Area Pages', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
    ] },
    { n: '3.3', name: 'Create, Fix, Optimize & Schedule', steps: [
      { n: '3.3.1', name: 'Technical AI Search (crawlability, llms.txt, robots.txt, schema)', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '3.3.2', name: 'Content for AI Search', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '3.3.3', name: 'Entity & Authority', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '3.3.4', name: 'AI Visibility Tracking', gated: false, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '3.3.5', name: 'E-E-A-T / Trust Signals', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '3.3.6', name: 'AI Answer Citation Monitoring', gated: false, output: 'verified result/status + evidence; approved version only if live action is involved' },
    ] },
    { n: '3.4', name: 'Upload, Publish, Monitor & Report', steps: [
      { n: '3.4.1', name: 'Review Response & Reputation SEO', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '3.4.2', name: 'Local NAP Consistency', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '3.4.3', name: 'PR', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '3.4.4', name: 'Video SEO', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '3.4.5', name: 'Image SEO', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '3.4.6', name: 'Ecommerce SEO', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
    ] },
  ],
  '4': [
    { n: '4.1', name: 'Research, Extract, Audit & Analyze', steps: [
      { n: '4.1.1', name: 'Meeting Notes to Content', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '4.1.2', name: 'Prompts', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '4.1.3', name: 'Editorial Briefs & Fact Checking', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '4.1.4', name: 'Creative Brand QA & FAQs', gated: false, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '4.1.5', name: 'Standard Posts', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '4.1.6', name: 'Monster Posts', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '4.1.7', name: 'Case studies', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '4.1.8', name: 'Whitepapers', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '4.1.9', name: 'Homepage', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '4.1.10', name: 'Inner Page', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '4.1.11', name: 'Service Page', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '4.1.12', name: 'Location Page', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '4.1.13', name: 'Knowledge Page', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '4.1.14', name: 'Landing Page', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
    ] },
    { n: '4.2', name: 'Recommend, Strategize, Plan & Client Review', steps: [
      { n: '4.2.1', name: 'Podcasts', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
    ] },
    { n: '4.3', name: 'Create, Fix, Optimize & Schedule', steps: [
      { n: '4.3.1', name: 'Reels', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '4.3.2', name: 'Brand Video', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '4.3.3', name: 'Explainer', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '4.3.4', name: 'Long Video', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '4.3.5', name: 'Repurposing & Distribution Packages', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
    ] },
    { n: '4.4', name: 'Upload, Publish, Monitor & Report', steps: [
      { n: '4.4.1', name: 'Featured / Banner Image', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '4.4.2', name: 'Social Media Image', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '4.4.3', name: 'Infographic', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '4.4.4', name: 'Image Ad', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '4.4.5', name: 'Accessibility Captions & Alt Text', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
    ] },
  ],
  '5': [
    { n: '5.1', name: 'Research, Extract, Audit & Analyze', steps: [
      { n: '5.1.1', name: 'Audience & Keyword Targeting', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '5.1.2', name: 'Budget & Bidding', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '5.1.3', name: 'Conversion Tracking', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '5.1.4', name: 'Offline Conversion Imports', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
    ] },
    { n: '5.2', name: 'Recommend, Strategize, Plan & Client Review', steps: [
      { n: '5.2.1', name: 'Ad Creative & Copy', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '5.2.2', name: 'Ad/Post Versions & Translation', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '5.2.3', name: 'Video Ad', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '5.2.4', name: 'Landing Page / Ad Message Match', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
    ] },
    { n: '5.3', name: 'Create, Fix, Optimize & Schedule', steps: [
      { n: '5.3.1', name: 'Campaign Structure & Launch', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '5.3.2', name: 'Meta Ads (Facebook / Instagram)', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '5.3.3', name: 'Google Ads', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '5.3.4', name: 'Other Platforms (LinkedIn, YouTube, Local Services, Reddit, Quora, X)', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '5.3.5', name: 'Policy & Disapproval Checks', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
    ] },
    { n: '5.4', name: 'Upload, Publish, Monitor & Report', steps: [
      { n: '5.4.1', name: 'Campaign Optimization & A/B Tests', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '5.4.2', name: 'Search Terms & Negative Keywords', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '5.4.3', name: 'Pacing & Spend Anomalies', gated: false, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '5.4.4', name: 'Lead Quality Feedback Loop', gated: false, output: 'verified result/status + evidence; approved version only if live action is involved' },
    ] },
  ],
  '6': [
    { n: '6.1', name: 'Research, Extract, Audit & Analyze', steps: [
      { n: '6.1.1', name: 'Platform Strategy & Calendar', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '6.1.2', name: 'Social Listening', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '6.1.3', name: 'Social Media Posts', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
    ] },
    { n: '6.2', name: 'Recommend, Strategize, Plan & Client Review', steps: [
      { n: '6.2.1', name: 'Publishing & Scheduling', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '6.2.2', name: 'GBP Publishing', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '6.2.3', name: 'Website Publishing', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
    ] },
    { n: '6.3', name: 'Create, Fix, Optimize & Schedule', steps: [
      { n: '6.3.1', name: 'Social Engagement', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '6.3.2', name: 'Community Moderation', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
    ] },
    { n: '6.4', name: 'Upload, Publish, Monitor & Report', steps: [
      { n: '6.4.1', name: 'UTM & Link Tracking', gated: false, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '6.4.2', name: 'Social Analytics & Experiments', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
    ] },
  ],
  '7': [
    { n: '7.1', name: 'Research, Extract, Audit & Analyze', steps: [
      { n: '7.1.1', name: 'Brand Identity & Guidelines', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '7.1.2', name: 'Positioning & Messaging', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '7.1.3', name: 'Consistency & Asset Governance', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '7.1.4', name: 'Brand SERP & Knowledge Panel', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
    ] },
    { n: '7.2', name: 'Recommend, Strategize, Plan & Client Review', steps: [
      { n: '7.2.1', name: 'Share of Voice & Mentions', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '7.2.2', name: 'Reputation & Review Management', gated: false, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '7.2.3', name: 'Brand Safety & Crisis Escalation', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '7.2.4', name: 'PR & Digital Mentions', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
    ] },
    { n: '7.3', name: 'Create, Fix, Optimize & Schedule', steps: [
      { n: '7.3.1', name: 'Backlinks', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '7.3.2', name: 'Citation Creation / Management', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '7.3.3', name: 'Citations Creation', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '7.3.4', name: 'Influencer / Creator Collaboration', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
    ] },
    { n: '7.4', name: 'Upload, Publish, Monitor & Report', steps: [
      { n: '7.4.1', name: 'Banners', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '7.4.2', name: 'Print', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '7.4.3', name: 'Conferences', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '7.4.4', name: 'Meetups', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
    ] },
  ],
  '8': [
    { n: '8.1', name: 'Research, Extract, Audit & Analyze', steps: [
      { n: '8.1.1', name: 'Lead Capture to CRM', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '8.1.2', name: 'Lead Source Deduplication', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '8.1.3', name: 'Spam / Fraud Filtering', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
    ] },
    { n: '8.2', name: 'Recommend, Strategize, Plan & Client Review', steps: [
      { n: '8.2.1', name: 'ICP Fit & Intent Enrichment', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '8.2.2', name: 'Lead Scoring & Qualification', gated: false, output: 'sourced findings / structured research record (no live changes)' },
    ] },
    { n: '8.3', name: 'Create, Fix, Optimize & Schedule', steps: [
      { n: '8.3.1', name: 'MQL Definition & SLA', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '8.3.2', name: 'Qualification Feedback & Calibration', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
    ] },
    { n: '8.4', name: 'Upload, Publish, Monitor & Report', steps: [
      { n: '8.4.1', name: 'Lead Alerts', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '8.4.2', name: 'Routing to Sales / CRM', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
    ] },
  ],
  '9': [
    { n: '9.1', name: 'Research, Extract, Audit & Analyze', steps: [
      { n: '9.1.1', name: 'CRM Field Mapping & Hygiene', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '9.1.2', name: 'Contact / Account Deduplication', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '9.1.3', name: 'Lead Capture (Email, Ads, Enquiries & Business Cards)', gated: false, output: 'sourced findings / structured research record (no live changes)' },
    ] },
    { n: '9.2', name: 'Recommend, Strategize, Plan & Client Review', steps: [
      { n: '9.2.1', name: 'Lifecycle Stages & Pipeline', gated: true, output: 'proposed plan/specification plus recorded client review decision' },
      { n: '9.2.2', name: 'Revenue Attribution & Closed-loop Feedback', gated: false, output: 'sourced findings / structured research record (no live changes)' },
    ] },
    { n: '9.3', name: 'Create, Fix, Optimize & Schedule', steps: [
      { n: '9.3.1', name: 'WhatsApp Follow-up', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '9.3.2', name: 'Email Outreach', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '9.3.3', name: 'LinkedIn Outreach', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
    ] },
    { n: '9.4', name: 'Upload, Publish, Monitor & Report', steps: [
      { n: '9.4.1', name: 'Lead Alerts', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '9.4.2', name: 'Automated Nurture Sequences', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '9.4.3', name: 'Sales Handoff & Notifications', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
    ] },
  ],
  '10': [
    { n: '10.1', name: 'Research, Extract, Audit & Analyze', steps: [
      { n: '10.1.1', name: 'On-demand Report', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '10.1.2', name: 'Duration Report (Weekly / Monthly)', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '10.1.3', name: 'Analytics (GA, GSC) Report', gated: false, output: 'sourced findings / structured research record (no live changes)' },
    ] },
    { n: '10.2', name: 'Recommend, Strategize, Plan & Client Review', steps: [
      { n: '10.2.1', name: 'Ad Performance Report', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '10.2.2', name: 'Social Media Engagement Report', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '10.2.3', name: 'Competitor Benchmarking', gated: false, output: 'sourced findings / structured research record (no live changes)' },
      { n: '10.2.4', name: 'SEO Report', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
    ] },
    { n: '10.3', name: 'Create, Fix, Optimize & Schedule', steps: [
      { n: '10.3.1', name: 'Brand Building Report', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '10.3.2', name: 'Dashboard (Unified KPI Dashboard)', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '10.3.3', name: 'Client Project Report', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
    ] },
    { n: '10.4', name: 'Upload, Publish, Monitor & Report', steps: [
      { n: '10.4.1', name: 'Weekly Summary', gated: true, output: 'draft asset/configuration or proposed change/schedule, ready for review; not live' },
      { n: '10.4.2', name: 'Publish (placeholder)', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
      { n: '10.4.3', name: 'Distribute (placeholder)', gated: true, output: 'verified result/status + evidence; approved version only if live action is involved' },
    ] },
  ],
}
