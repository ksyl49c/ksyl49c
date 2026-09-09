# Lumen — Learning Disability & Autism Support OS (Prototype)

A frontend prototype for a support-operations platform for learning disability
and autism services (supported living, residential, day services and
outreach). Adapted from the Meridian nursing-home OS template, rebuilt around
person-centred practice, Positive Behaviour Support (PBS), and UK regulatory
frameworks (CQC, Mental Capacity Act / DoLS-LPS, STOMP, Oliver McGowan
Mandatory Training). Mock data only — no backend.

## Modules

- **Voice-First Documentation** — support workers narrate observations on
  shift; a live transcription demo shows speech auto-structuring into ABC
  (Antecedent-Behaviour-Consequence) charts, sensory logs, daily living
  notes, and PBS plan updates (Documentation), plus restrictive practice
  logs, safeguarding flags, and incident reports (Safety & Incidents).
- **Compliance & Audit** — a live regulatory requirement ledger covering
  restrictive practice reduction, STOMP medication reviews, DoLS/LPS
  authorisation status, Oliver McGowan training completion, and PBS plan
  review cycles, plus upcoming inspection readiness and evidence-gap
  detection.
- **Resident Graph** — a connected, person-centred profile: diagnoses and
  communication needs, communication passport (likes, dislikes, triggers,
  calming strategies), sensory profile, therapy design and adherence
  (SaLT, OT, PBS, physiotherapy, psychology), circle of support, and life
  journey/transition history — all linked from one visual graph per person.
- **Predictive Intelligence** — behavioural escalation and placement
  stability risk, PBS plan effectiveness scoring, support-hours demand
  forecasting, and a dedicated **diagnostic overshadowing watch** that flags
  when a behaviour change looks more like an unmet physical health need than
  an escalation — a well-documented risk for this population.
- **Family & Communication** — AI-drafted updates for family, social
  workers, GPs and advocates generated from care documentation, including
  easy-read versions written for the person themselves, reviewed and sent
  by staff.
- **Operations** — staffing and 1:1/2:1 support ratio tracking, sensory
  equipment & communication aid stock levels, room and environment
  management (bedrooms, sensory rooms, low-arousal rooms), community
  activity and transport scheduling, and maintenance tickets.

## Design notes

Built with reduced motion, calm low-saturation colour, and the Atkinson
Hyperlegible typeface (designed for readability by the Braille Institute)
throughout, in line with sensory-friendly and accessible design practice for
this audience.

## Stack

Vite + React + TypeScript + Tailwind CSS v4 + Recharts + Lucide icons.
All data lives in `src/lib/mockData.ts`.

## Run

```bash
npm install
npm run dev
```
