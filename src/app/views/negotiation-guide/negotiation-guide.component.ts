import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GuideCard {
  icon: string;
  title: string;
  tips: { num: string; bold: string; rest: string }[];
}

interface PaymentPill {
  num: string;
  label: string;
  save: string;
  type: 'best' | 'good' | 'ok' | 'bad';
}

@Component({
  selector: 'app-negotiation-guide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './negotiation-guide.component.html',
  host: { style: 'display:flex;flex:1;overflow:hidden;' },
})
export class NegotiationGuideComponent {
  guideCards: GuideCard[] = [
    {
      icon: '💼', title: 'Before You Offer',
      tips: [
        { num: '1', bold: 'Research comparables',      rest: ' — Check last 90-day prices for similar 2/3 BHK units in Baner, Wakad, or Kharadi' },
        { num: '2', bold: 'Check unsold inventory',  rest: ' — Projects with 30+ days of unsold stock often allow 3–7% room to negotiate' },
        { num: '3', bold: 'Know your walk-away price', rest: ' — Set your max all-in budget before meeting the builder sales team' },
      ],
    },
    {
      icon: '🗣️', title: 'During Negotiation',
      tips: [
        { num: '1', bold: 'Offer stronger upfront payment', rest: ' — Higher down payment vs stretched plans can save ₹2–5 L on an ₹85 L unit' },
        { num: '2', bold: 'Fast booking timeline',          rest: ' — Commit to token and agreement within 7–14 days; sales teams reward certainty' },
        { num: '3', bold: 'Bundle concessions',             rest: ' — Ask for waived PLC, parking, or stamp-duty support in exchange for list price' },
      ],
    },
    {
      icon: '📉', title: 'Leverage Signals',
      tips: [
        { num: '1', bold: 'Slow quarter = your power', rest: ' — Every unsold unit adds carrying cost for the builder' },
        { num: '2', bold: 'Festive & year-end windows', rest: ' — Best deals often in Oct–Dec and Mar when sales targets peak' },
        { num: '3', bold: 'Comparable printout',        rest: ' — Show recent MahaRERA-registered sales in the same micro-market' },
      ],
    },
    {
      icon: '⚠️', title: 'Common Mistakes',
      tips: [
        { num: '✗', bold: "Don't lowball below 8%",        rest: ' — Builders disengage; aim for 3–6% below quoted all-in price' },
        { num: '✗', bold: "Don't show desperation",        rest: ' — Never say "this is our dream flat"' },
        { num: '✗', bold: "Don't skip MahaRERA check",     rest: ' — Always verify project registration before paying token' },
      ],
    },
  ];

  paymentPills: PaymentPill[] = [
    { num: '100%', label: 'Upfront',       save: 'Save ₹3–5 L',           type: 'best' },
    { num: '30%',  label: 'Down payment', save: 'Save ₹2–3 L',           type: 'good' },
    { num: '20%',  label: 'Down payment', save: 'Standard — no discount', type: 'ok'   },
    { num: '10%',  label: 'Down payment', save: '+₹1–2 L premium',       type: 'bad'  },
  ];
}
