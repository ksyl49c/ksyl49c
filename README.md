# Aevitas — Nursing Home Operating System (Prototype)

A frontend prototype for a care-operations platform for nursing homes, inspired
by the calm, warm, editorial design language of modern care-tech products.
Mock data only — no backend.

## Modules

- **Voice-First Documentation** — nurses narrate observations on the floor; a
  live transcription demo shows speech auto-structuring into nursing notes,
  care plan updates, wound assessments, MAR comments, and shift handovers
  (Documentation), plus falls, safeguarding flags, and near-miss logs
  (Safety & Incidents).
- **Resource Management** — an isometric live floor map of residents and
  staff (CSS 3D, no WebGL dependency), a capacity/burnout tracker per staff
  member, and one-tap "send backup" rebalancing when a nurse is overloaded.
- **Resident Monitoring** — deterioration signals, vitals trend charts,
  behavioral pattern tracking, and pain/comfort logging per resident.
- **Compliance & Audit** — a live regulatory requirement ledger, upcoming
  survey readiness, and evidence-gap detection.
- **Family & Communication** — AI-drafted family updates and query responses
  generated from care documentation, reviewed and sent by staff.
- **Operations** — supply/inventory burn-down, room & bed management, and
  maintenance tickets.
- **Predictive Intelligence** — hospitalization/readmission risk, care plan
  effectiveness scoring, and staff demand forecasting.

## Stack

Vite + React + TypeScript + Tailwind CSS v4 + Recharts + Lucide icons.
All data lives in `src/lib/mockData.ts`.

## Run

```bash
npm install
npm run dev
```
