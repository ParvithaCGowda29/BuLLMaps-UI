// The one place the BuLLMaps workflows live: 10 skills × 4 subskills × steps. The left rail, the assistant's router and
// the Results & edits plan all read this file, so changing a workflow means editing this file only.
// Format: each subskill is a heading, each step is "Name: what it does." (description optional).
// `icon` is the Tabler icon for the collapsed rail; `keywords` help the router pick the skill from a request.

export interface Step { name: string; description: string }
export interface Subskill { name: string; steps: Step[] }
export interface Skill { id: string; name: string; icon: string; keywords: string[]; subskills: Subskill[] }

const steps = (lines: string[]): Step[] => lines.map(l => {
  const i = l.indexOf(': ')
  return i < 0 ? { name: l, description: '' } : { name: l.slice(0, i), description: l.slice(i + 2) }
})

export const SKILLS: Skill[] = [
  { id: 'audit', name: 'Audit & Strategy', icon: 'tb-target', keywords: ['audit', 'strategy', 'roadmap', 'competitor', 'keyword', 'budget', 'forecast'], subskills: [
    { name: 'Audit & Discovery', steps: steps([
      'Audit: Overall marketing health check.',
      'Keyword: Keyword research for my services and city.',
      'Competitor: Compare with nearby competitors.',
      'Backlink: Backlink audit.',
      'Citation: Citation audit.',
      'Lead Drivers: Find what brings leads today.',
      'LinkedIn Profile & Company Page Audit: Audit of the LinkedIn profile and company page, with recommendations.',
      'GBP Audit: Audit of Google Business Profile.',
      'Website Audit: Audit of website.',
      'Brand Audit: Audit of brand presence.',
      'LinkedIn Lead Form: Audit of LinkedIn lead forms.',
    ]) },
    { name: 'Research & Baseline', steps: steps([
      'Business & Offer Discovery: Capture services, offers, pricing and goals; confirm with owner.',
      'Customer / ICP Research: Define who the ideal customers are and what they look for.',
      'Market Sizing & Opportunity: Estimate local demand and where the biggest opportunity is.',
      'Channel Attribution Baseline: Record which channels bring leads today.',
    ]) },
    { name: 'Recommend & Strategy', steps: steps([
      'Blueprint: Audit-to-action blueprint.',
      'Recommendations: Prioritised next actions from audit.',
      'Marketing Strategy & Positioning: Set the overall strategy and how we position the business.',
      'Budget & KPI Forecast: Set budget and expected leads, cost and targets.',
    ]) },
    { name: 'Plan & Review', steps: steps([
      'Plan: Marketing plan and goals.',
      'Plan/Roadmap: Prioritised plan and test roadmap for the next period.',
      'Content Calendar: Calendar of posts and campaigns.',
    ]) },
  ] },
  { id: 'website', name: 'Website', icon: 'tb-world', keywords: ['website', 'site', 'page', 'speed', 'mobile', 'form', 'cms', 'domain'], subskills: [
    { name: 'Crawl & Index Health', steps: steps([
      'Technical Crawl & Log Analysis: Crawl the site and find technical SEO issues.',
      'GSC Fix: Fix Google Search Console indexing issues.',
      'Page Indexing: Indexing checks.',
      'Uptime & Broken Link Monitoring: Alert on downtime and broken links.',
      'Redirects & Migrations: Handle redirects and URL changes safely.',
      'Schema: Structured data markup.',
    ]) },
    { name: 'Build & Structure', steps: steps([
      'Site Structure: Site architecture and URLs.',
      'Website Build: Build site.',
      'Page Build: Build pages.',
      'Programmatic Page: Programmatic pages.',
      'CMS Integration & Deployment: Connect the CMS and publish approved changes.',
      'Forms & Lead Routing: Make sure forms work and leads reach the right place.',
    ]) },
    { name: 'Experience & Performance', steps: steps([
      'Speed: Page speed / Core Web Vitals.',
      'Mobile: Mobile optimization.',
      'UX: UX review.',
      'Accessibility (WCAG): Check and fix site accessibility.',
      'Conversion Rate Optimization: Improve how many visitors enquire.',
    ]) },
    { name: 'Security, Compliance & Release', steps: steps([
      'Security: Security basics.',
      'Consent & Privacy Controls: Cookie banner, privacy policy and consent on site.',
      'Backup & Rollback: Back up the site; roll back a bad change.',
    ]) },
  ] },
  { id: 'seo', name: 'SEO (Organic, Local & AEO/GEO)', icon: 'tb-search', keywords: ['seo', 'rank', 'ranking', 'google', 'maps', 'local', 'gbp', 'search', 'chatgpt'], subskills: [
    { name: 'Organic Search', steps: steps([
      'Organic Rank Tracking: Track organic keyword rankings.',
      'Search Intent & Topic Clusters: Group keywords by intent into topics.',
      'Content Gap Analysis: Find topics competitors cover that we do not.',
      'On-page (Meta, OG, Headings): Meta titles, descriptions, OG tags, headings.',
      'Internal Links: Internal linking.',
      'Page Optimization: Optimize page content',
      'SEO Change Validation: Check an SEO change worked after it went live.',
    ]) },
    { name: 'Local & Maps', steps: steps([
      'GBP Optimization: Description, services, categories, service areas, NAP.',
      'GBP Posts & Reviews: Create and publish GBP posts; request and reply to reviews.',
      'Local Rank Tracking: Track local pack rank.',
      'Local Competitor Analysis: Nearby competitors.',
      'Service Area Analysis: Service area optimization.',
      'Service Area Pages: Location pages optimization',
      'Review Response & Reputation SEO: Reply to reviews and use them for local visibility.',
      'Local NAP Consistency: Keep name, address and phone identical everywhere.',
    ]) },
    { name: 'AI Search (AEO / GEO)', steps: steps([
      'Technical AI Search (crawlability, llms.txt, robots.txt, schema): Make site readable by AI crawlers.',
      'Content for AI Search: Intent-first, direct-answer, FAQ, chunked, fresh content.',
      'Entity & Authority: Entity clarity, topical authority, knowledge graph, trust signals.',
      'AI Visibility Tracking: AI referral traffic, citation frequency, share of voice, brand radar.',
      'E-E-A-T / Trust Signals: Check and add experience, authority and trust signals.',
      'AI Answer Citation Monitoring: Track whether AI answers cite the business.',
    ]) },
    { name: 'Specialty SEO & PR', steps: steps([
      'PR: Press release',
      'Video SEO: Title, tags, description, chapters.',
      'Image SEO: Alt text, compression.',
      'Ecommerce SEO',
    ]) },
  ] },
  { id: 'content', name: 'Content & Creatives', icon: 'tb-photo', keywords: ['reel', 'video', 'image', 'blog', 'article', 'creative', 'content', 'banner', 'podcast', 'write'], subskills: [
    { name: 'Brief & Source', steps: steps([
      'Meeting Notes to Content: Turn meeting notes / voice notes into content.',
      'Prompts: Prompt library for generation.',
      'Editorial Briefs & Fact Checking: Write content briefs; verify facts before publishing.',
      'Creative Brand QA & FAQs: Check creatives against brand rules; answer common questions.',
    ]) },
    { name: 'Written Content', steps: steps([
      'Standard Posts: Standard blog posts.',
      'Monster Posts: Long pillar posts.',
      'Case studies: Case studies optimization',
      'Whitepapers: Whitepapers optimization',
      'Homepage: Homepage content and SEO.',
      'Inner Page: Inner page SEO.',
      'Service Page: Service pages.',
      'Location Page: Location pages.',
      'Knowledge Page: Knowledge pages.',
      'Landing Page: Landing pages for campaigns.',
    ]) },
    { name: 'Image & Audio', steps: steps([
      'Featured / Banner Image: Blog and site banners.',
      'Social Media Image: Post images / GBP post images.',
      'Infographic: Infographics.',
      'Image Ad: Ad creatives.',
      'Accessibility Captions & Alt Text: Add captions and alt text.',
      'Podcasts: Podcast content.',
    ]) },
    { name: 'Video & Repurposing', steps: steps([
      'Reels: Short vertical videos with subtitles.',
      'Brand Video: Brand story video.',
      'Explainer: Explainer video.',
      'Long Video: Long-form YouTube video.',
      'Repurposing & Distribution Packages: Turn one piece into versions for other channels.',
    ]) },
  ] },
  { id: 'ads', name: 'Paid Ads', icon: 'tb-speakerphone', keywords: ['ads', 'ad', 'campaign', 'meta', 'facebook', 'boost', 'spend', 'budget', 'cpc', 'ppc'], subskills: [
    { name: 'Targeting & Tracking Setup', steps: steps([
      'Audience & Keyword Targeting: Targeting setup.',
      'Budget & Bidding: Budget, bids, pacing.',
      'Conversion Tracking: Pixels and conversions.',
      'Offline Conversion Imports: Send phone and in-clinic conversions back to ad platforms.',
    ]) },
    { name: 'Creative & Messaging', steps: steps([
      'Ad Creative & Copy: Creative, copy and variants.',
      'Ad/Post Versions & Translation: Make different versions of an ad or post to test, and adapt them to another language or area.',
      'Video Ad: Video ad creative.',
      'Landing Page / Ad Message Match: Check the landing page matches the ad promise.',
    ]) },
    { name: 'Campaign Build & Launch', steps: steps([
      'Campaign Structure & Launch: Set up campaigns and launch after approval.',
      'Meta Ads (Facebook / Instagram): Create and run Meta campaigns.',
      'Google Ads: Create and run Google campaigns.',
      'Other Platforms (LinkedIn, YouTube, Local Services, Reddit, Quora, X): Additional ad platforms.',
      'Policy & Disapproval Checks: Check ads against platform policy; fix disapprovals.',
    ]) },
    { name: 'Optimize & Monitor', steps: steps([
      'Campaign Optimization & A/B Tests: Optimise by performance.',
      'Search Terms & Negative Keywords: Review search terms; add negative keywords.',
      'Pacing & Spend Anomalies: Alert if spend runs too fast, slow or odd.',
      'Lead Quality Feedback Loop: Feed lead quality back into ad targeting.',
    ]) },
  ] },
  { id: 'social', name: 'Social Media', icon: 'tb-share', keywords: ['social', 'post', 'plan', 'instagram', 'facebook', 'linkedin', 'twitter', 'youtube', 'comment', 'schedule', 'calendar'], subskills: [
    { name: 'Strategy & Listening', steps: steps([
      'Platform Strategy & Calendar: Choose platforms and plan the posting calendar.',
      'Social Listening: Watch mentions and conversations about the business.',
    ]) },
    { name: 'Create & Publish', steps: steps([
      'Social Media Posts: Copy and format posts per platform (Facebook, Instagram, X, LinkedIn, YouTube, Reddit, Quora).',
      'Publishing & Scheduling: Publish now or schedule.',
      'GBP Publishing: Push posts to GBP.',
      'Website Publishing: Publish to site / CMS.',
    ]) },
    { name: 'Engage & Moderate', steps: steps([
      'Social Engagement: Reply to comments and DMs.',
      'Community Moderation: Moderate comments and flag problems.',
    ]) },
    { name: 'Track & Learn', steps: steps([
      'UTM & Link Tracking: Tag links so leads trace to the post or ad.',
      'Social Analytics & Experiments: Analyse post results; run small tests.',
    ]) },
  ] },
  { id: 'brand', name: 'Brand', icon: 'tb-award', keywords: ['brand', 'logo', 'reputation', 'review', 'mention', 'pr', 'influencer', 'print', 'event'], subskills: [
    { name: 'Brand Identity & Consistency', steps: steps([
      'Brand Identity & Guidelines: Keep logo, colours, fonts and tone guidelines.',
      'Positioning & Messaging: Define key messages and positioning.',
      'Consistency & Asset Governance: Keep brand assets consistent and approved.',
      'Brand SERP & Knowledge Panel: Check what shows when the brand is searched.',
    ]) },
    { name: 'Reputation & Mentions', steps: steps([
      'Share of Voice & Mentions: Track brand mentions vs competitors.',
      'Reputation & Review Management: Monitor and manage online reviews.',
      'Brand Safety & Crisis Escalation: Flag brand risks and escalate to the owner.',
      'PR & Digital Mentions: Pursue and track press and online mentions.',
    ]) },
    { name: 'Authority Building', steps: steps([
      'Backlinks',
      'Citation Creation / Management: Citations/NAP consistency.',
      'Citations Creation: Create new citations',
      'Influencer / Creator Collaboration: Find and manage creator collaborations.',
    ]) },
    { name: 'Traditional & Offline', steps: steps([
      'Banners',
      'Print',
      'Conferences',
      'Meetups',
    ]) },
  ] },
  { id: 'mql', name: 'MQL', icon: 'tb-filter', keywords: ['lead', 'leads', 'mql', 'qualify', 'score', 'spam', 'enquiry', 'whatsapp'], subskills: [
    { name: 'Capture & Clean', steps: steps([
      'Lead Capture to CRM: Capture leads from WhatsApp, forms, ads into a list.',
      'Lead Source Deduplication: Merge duplicate leads across sources.',
      'Spam / Fraud Filtering: Filter spam and fake leads.',
    ]) },
    { name: 'Enrich & Score', steps: steps([
      'ICP Fit & Intent Enrichment: Add fit and intent details to leads.',
      'Lead Scoring & Qualification: Score and qualify new leads.',
    ]) },
    { name: 'Define & Calibrate', steps: steps([
      'MQL Definition & SLA: Define what counts as an MQL and response time.',
      'Qualification Feedback & Calibration: Adjust scoring using sales feedback.',
    ]) },
    { name: 'Alert & Route', steps: steps([
      'Lead Alerts: Notify owner of new leads.',
      'Routing to Sales / CRM: Send qualified leads to the right person or CRM.',
    ]) },
  ] },
  { id: 'crm', name: 'CRM', icon: 'tb-address-book', keywords: ['crm', 'contact', 'pipeline', 'follow', 'nurture', 'email', 'outreach', 'sales'], subskills: [
    { name: 'Sync & Hygiene', steps: steps([
      'CRM Field Mapping & Hygiene: Keep CRM fields mapped and clean.',
      'Contact / Account Deduplication: Merge duplicate contacts and accounts.',
    ]) },
    { name: 'Pipeline & Attribution', steps: steps([
      'Lifecycle Stages & Pipeline: Define lead stages and pipeline.',
      'Revenue Attribution & Closed-loop Feedback: Link revenue back to the channel that brought the lead.',
    ]) },
    { name: 'Follow-up Outreach', steps: steps([
      'WhatsApp Follow-up: Reply and nurture on WhatsApp.',
      'Email Outreach: Email campaigns.',
      'LinkedIn Outreach: LinkedIn messages.',
    ]) },
    { name: 'Alerts, Nurture & Handoff', steps: steps([
      'Lead Alerts: Notify owner of new leads.',
      'Automated Nurture Sequences: Automated follow-up sequences for leads.',
      'Sales Handoff & Notifications: Notify the owner or sales when a lead is ready.',
    ]) },
  ] },
  { id: 'reports', name: 'Reports & Publishing', icon: 'tb-report-analytics', keywords: ['report', 'week', 'weekly', 'month', 'monthly', 'perform', 'results', 'dashboard', 'kpi', 'analytics'], subskills: [
    { name: 'Request & Data Pull', steps: steps([
      'On-demand Report: Report for any period, anytime.',
      'Duration Report (Weekly / Monthly): Scheduled weekly or monthly summary.',
      'Analytics (GA, GSC) Report: Website traffic, search clicks and rankings.',
    ]) },
    { name: 'Performance Reports', steps: steps([
      'Ad Performance Report: Spend, leads, cost per lead by campaign.',
      'Social Media Engagement Report: Reach, engagement and follower growth by platform.',
      'Competitor Benchmarking: Compare with nearby competitors.',
      'SEO Report: Rankings, traffic, issues.',
      'Brand Building Report: Brand growth.',
    ]) },
    { name: 'Dashboards & Client Reports', steps: steps([
      'Dashboard (Unified KPI Dashboard): One screen with the key business and marketing numbers.',
      'Client Project Report: Status of projects and deliverables for the client.',
      'Weekly Summary: WhatsApp summary each week.',
    ]) },
    { name: 'Publish & Distribute', steps: steps([
      'Publish (placeholder)',
      'Distribute (placeholder)',
    ]) },
  ] },
]
