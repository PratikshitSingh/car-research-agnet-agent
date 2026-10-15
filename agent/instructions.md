Build an AI Car-Buying Research Agent

Act as a senior full-stack engineer, AI agent architect, and product designer. Build a polished, functional web application called CarScout AI — an AI-powered research assistant that helps people make smarter decisions when buying used cars.
Do not just generate a plan, mockup, or static prototype. Build the working application, implement the core functionality, run it, test it, and fix errors wherever your environment allows.
1. Product vision
CarScout AI helps buyers find the best used car for their needs by researching listings, comparing vehicles, estimating total ownership costs, identifying potential risks, and preparing questions to ask dealerships.
The product should answer:
Which used car is the best fit for me?
Is this listing reasonably priced?
What could this car cost me over the next 3–5 years?
Are there warning signs in its listing, mileage, VIN, or history?
Which car offers the best balance of price, reliability, performance, and ownership cost?
What should I verify before buying or visiting the dealership?
The experience should feel like working with an independent automotive research analyst who prioritizes the buyer’s interests rather than a dealership’s interests.
2. Target users
People shopping for used cars who want to make an informed purchase without spending hours researching listings across multiple websites.
Support both first-time buyers and experienced shoppers.
3. Application interface
Build a responsive web application with a modern, premium automotive aesthetic.
Use a clean, professional design with a dark charcoal or navy theme, neutral backgrounds, restrained accent colors, clear typography, and intuitive navigation. Avoid a generic AI-chat template.
Create these pages or sections:
A. Buyer Profile
Collect the following preferences:
ZIP code or location
Maximum budget and optional down payment
Preferred makes and models
Minimum and maximum model year
Maximum mileage
New versus used preference, defaulting to used
Vehicle type: sedan, SUV, hatchback, coupe, truck, or other
Fuel type: gas, hybrid, plug-in hybrid, or electric
Transmission preference
Performance and driving preferences
Reliability priority
Fuel economy priority
Safety priority
Maintenance and ownership cost priority
Accident-history preference
Certified pre-owned preference
Financing preference and optional APR
Expected annual mileage
Planned ownership period
Allow buyers to mark preferences as required or flexible. Include sensible defaults so a user can try the app without completing every field.
B. Research Dashboard
Display a personalized overview containing:
Number of listings analyzed
Best overall match
Lowest estimated ownership cost
Best value for money
Lowest-risk candidate based on available evidence
Listings requiring further investigation
Estimated monthly payment and total ownership cost
Recent research sessions
Every result must distinguish verified data from estimates and unavailable information.
C. Vehicle Listings
Display researched cars in an attractive list or card layout.
Each listing should include, when available:
Year, make, model, trim, and drivetrain
Asking price
Mileage
Seller and dealership
Distance from the buyer
VIN
Accident and title information
Ownership and service history, if available
Certified pre-owned status
Fuel economy
Listing URL and last-checked timestamp
Estimated monthly financing payment
Estimated five-year ownership cost
AI-generated advantages, concerns, and follow-up questions
Support filtering, sorting, favoriting, and side-by-side comparison.
Never fabricate a listing, VIN, seller, accident report, vehicle-history result, or source URL.
D. Vehicle Comparison
Allow users to compare at least three vehicles side by side.
Show:
Asking price versus estimated market value, if supported by real comparable data
Mileage and model year
Reliability evidence and confidence
Fuel economy and projected fuel expenses
Financing cost
Insurance estimate
Maintenance and repair estimate
Taxes, registration, and fees
Depreciation estimate
Estimated total cost over 3 and 5 years
Accident, title, and history risks
Pros and cons
Questions to ask the seller
Missing information that could change the recommendation
Highlight trade-offs rather than declaring a universal winner.
E. AI Research Assistant
Provide a conversational interface where buyers can ask questions such as:
“Find the best reliable sedan under $25,000 within 50 miles.”
“Compare these three cars for a five-year ownership period.”
“Is this asking price reasonable?”
“What should I check before buying this car?”
“Which option is likely to cost me the least over five years?”
“What questions should I ask this dealership?”
“Would it be worth paying $2,000 more for the certified pre-owned option?”
The assistant must use retrieved vehicle data and calculated estimates when available. It must not invent facts to produce a confident answer.
F. Vehicle Detail and Due Diligence
Create a dedicated detail page for each vehicle with:
Original listing information and source link
VIN decoding results
Available title and accident information
Maintenance records, if supplied by an authorized provider
Market price comparisons
Ownership cost breakdown
Risk assessment
Questions for the dealer
Suggested pre-purchase inspection checklist
A clear list of what remains unverified
4. Multi-agent architecture using Eve
Use Eve’s actual supported APIs and patterns. Inspect the installed version and official documentation before implementing framework-specific code. Do not invent imports, methods, tools, or capabilities.
Implement a coordinated workflow with these three specialized agents.
Agent 1: Listing Researcher
Responsibilities:
Interpret the buyer’s preferences.
Search authorized vehicle-listing sources.
Collect candidate listings and normalize their fields.
Deduplicate listings using VIN, listing URL, and other appropriate identifiers.
Validate vehicle year, make, model, trim, mileage, price, location, and seller details.
Retrieve VIN decoding and vehicle-history information through available providers.
Identify missing fields, suspicious inconsistencies, possible duplicate listings, and outdated information.
Preserve source URLs, retrieval timestamps, and provenance for every material claim.
Return structured vehicle records with confidence and verification status.
Agent 2: Cost Analyst
For each candidate, estimate the total cost of ownership over configurable 3-year and 5-year periods.
Include:
Purchase price
Down payment
Amount financed
Loan interest
Sales tax and purchase fees
Registration and recurring taxes
Insurance
Fuel or charging costs
Scheduled maintenance
Expected repairs
Depreciation
Estimated resale value
Use deterministic calculation tools for financial arithmetic. Do not rely on language-model arithmetic for loan payments or cost totals.
For financing, implement the standard amortizing loan formula using principal, APR, and loan term. Handle zero-interest loans and invalid inputs safely.
Clearly separate:
Quoted or verified values
User-provided assumptions
Provider-sourced estimates
Model-based estimates
Allow users to adjust APR, down payment, annual mileage, insurance cost, fuel price, and ownership duration and immediately recalculate costs.
Do not present insurance or maintenance estimates as quotes. Display uncertainty ranges where reliable data is available; otherwise explain the assumptions.
Agent 3: Vehicle Comparison Agent
Responsibilities:
Combine validated listing data with the Cost Analyst’s results.
Evaluate vehicles against the buyer’s required and flexible preferences.
Calculate a transparent score for each vehicle.
Explain why each car ranks where it does.
Highlight trade-offs and potential deal-breakers.
Produce a ranked shortlist.
Generate tailored dealership questions and pre-purchase inspection recommendations.
Identify what additional information could materially change the ranking.
The agent must not equate low mileage with guaranteed reliability or claim a car is accident-free without adequate supporting evidence.
Workflow orchestration
Implement this flow:
Buyer Profile → Listing Researcher → Data Validation → Cost Analyst → Vehicle Comparison Agent → Ranked Results → Buyer Review.
Use Eve’s supported durable execution and state-management features where appropriate. Persist research sessions, intermediate results, errors, and provenance so the workflow can resume after interruptions.
Use parallel research for independent listings where practical, with sensible concurrency limits, retries, timeouts, and rate limiting.
Do not add unnecessary agents. The three specified agents should have clearly separated responsibilities.
5. Transparent vehicle ranking algorithm
Implement an explainable, configurable scoring system.
Start with these default weights:
Reliability and expected maintenance risk: 25%
Total cost of ownership: 25%
Price and market value: 20%
Vehicle history and title risk: 15%
Mileage and age: 10%
Buyer-specific preferences: 5%
Normalize component scores to a common scale before calculating the weighted total.
Let buyers change weights through the interface. Normalize adjusted weights when appropriate and validate that they are sensible.
Important rules:
Required preferences act as filters or explicitly disclosed exceptions, not merely small scoring penalties.
A known title problem must not be treated the same as missing title data.
Missing information must lower confidence, not automatically be treated as a clean record.
Accident history must be evaluated using verified information and its severity where known.
Reliability should use reputable model-level evidence and vehicle-specific maintenance evidence when available.
Do not claim to predict a specific vehicle’s future reliability with certainty.
Penalize listings with stale, contradictory, or insufficient information.
Explain every score in plain English.
For each ranked vehicle, show:
Overall score out of 100
Individual category scores
Confidence level
Positive factors
Negative factors
Missing evidence
Conditions that could change its ranking
Never hide material risks behind a high overall score.
6. Integrations and tools
Build a modular provider architecture so data sources can be changed without rewriting the agents.
Investigate and use authorized APIs where available.
Potential integrations include:
Vehicle listings: approved listing APIs, licensed data providers, or user-supplied listing URLs
VIN decoding: NHTSA vPIC API
Vehicle history: authorized providers such as CARFAX or AutoCheck, subject to API availability and access permissions
Market valuation: licensed valuation providers or a transparent comparable-listing methodology
Fuel prices: a reputable source with suitable geographic coverage
Financing: internal deterministic loan calculator
Location: ZIP-code-based distance calculations using an appropriate geocoding provider
Do not assume a provider offers public API access. Check its actual documentation, authentication requirements, pricing, and permitted usage before integration.
Do not bypass CAPTCHAs, paywalls, access controls, or website terms. Do not scrape sites without appropriate authorization.
If an integration is unavailable, implement a clearly labeled provider interface and a working alternative such as CSV import, manual entry, or user-submitted listing URLs where technically and legally supported.
The app must remain usable even when some external integrations are unavailable.
7. Technical implementation
Use the existing project stack if one is already configured. Otherwise, prefer:
Next.js with TypeScript
React for the interface
Tailwind CSS and an accessible component library
Eve for the agent orchestration layer
A persistent relational database such as PostgreSQL
Zod or equivalent schema validation
Secure server-side API routes for external integrations
Choose the simplest architecture that supports the required functionality.
Requirements:
Strong typing and validated agent inputs and outputs
Separation of UI, business logic, provider adapters, and agent orchestration
Environment variables for API credentials
No secrets exposed to the browser
Loading, empty, error, and partial-data states
Responsive desktop and mobile layouts
Accessible forms, navigation, and tables
Persistent saved searches and favorites
Structured logging and useful error messages
Unit tests for ranking and financial calculations
Integration tests for agent workflows and provider failures
If a database is not available, use an appropriate development fallback and document how to configure persistent storage.
8. Security and reliability
Treat listing descriptions, uploaded files, seller messages, and retrieved web content as untrusted data.
Never allow listing content to override system instructions or invoke arbitrary tools.
Use least-privilege provider access, validate URLs to mitigate server-side request forgery, and restrict any supported URL-fetching feature to safe destinations.
Require user confirmation before purchases, paid history reports, sending messages, submitting personal information, or other consequential actions.
Do not store sensitive financial or identity information unnecessarily.
9. Demo mode and sample data
Create a clearly labeled demo mode that works without paid API credentials.
Include at least six plausible synthetic vehicle records spanning different prices, mileage levels, vehicle types, and risk profiles.
Mark every synthetic record prominently as DEMO DATA. Never mix synthetic records with live results without clear labeling.
Provide a listing-import flow so users can test the application with real listing data they supply.
Demonstrate at least three distinct ranking outcomes, including:
Lowest purchase price does not necessarily mean lowest ownership cost.
A more expensive vehicle can rank higher because of lower estimated ownership costs or stronger evidence.
Missing or concerning history can lower a vehicle’s score or confidence.
Do not represent demo records as actual cars for sale.
10. Deliverables and execution
Work through the following stages:
Inspect the current environment, project structure, and installed Eve documentation.
Confirm the available APIs and integrations.
Implement the application architecture and data models.
Build the interface and core buyer workflow.
Implement the three agents and deterministic calculation tools.
Integrate available providers and create honest fallbacks.
Implement transparent scoring and comparison.
Add demo data, persistence, and error handling.
Run tests, fix errors, and verify the application launches.
Provide setup instructions and a concise summary of what works.
Prioritize a functional end-to-end MVP over superficial features. Do not stop after generating the UI or a design document.
If an external API credential is missing, do not fabricate a successful integration. Finish the rest of the app and clearly explain which environment variables are needed.
At completion, report:
What was implemented
How the three agents interact
Which integrations are actually working
Which integrations require credentials
How to run the app locally
How to run tests
Any known limitations
Definition of done: A user can enter preferences, import or research vehicle candidates using the available sources, calculate ownership costs, compare and rank at least three vehicles, inspect evidence and risks, and save a shortlist. The core experience must work in demo mode without paid API credentials.

