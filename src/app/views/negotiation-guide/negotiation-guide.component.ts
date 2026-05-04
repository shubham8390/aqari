import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GuideCard {
  icon: string;
  title: string;
  tips: { num: string; bold: string; rest: string }[];
}

interface ChequePill {
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
        { num: '1', bold: 'Research comparables',     rest: ' — Know the last 90-day avg rent for similar units in the same building' },
        { num: '2', bold: 'Check days on market',     rest: ' — Units listed 30+ days give 7–10% more room to negotiate' },
        { num: '3', bold: 'Know your walk-away price', rest: ' — Decide your max before talking to any broker' },
      ],
    },
    {
      icon: '🗣️', title: 'During Negotiation',
      tips: [
        { num: '1', bold: 'Offer fewer cheques', rest: ' — 1–2 cheques vs 4–12 can save AED 5K–10K annually' },
        { num: '2', bold: 'Fast timeline',        rest: ' — Commit to signing within 2 weeks; landlords reward certainty' },
        { num: '3', bold: 'Package deal',         rest: ' — Offer to cover minor maintenance in exchange for rent reduction' },
      ],
    },
    {
      icon: '📉', title: 'Leverage Signals',
      tips: [
        { num: '1', bold: 'Vacancy = your power',   rest: ' — Every empty day costs the landlord AED 300–500' },
        { num: '2', bold: 'Off-peak timing',         rest: ' — Best deals in Q1 and Q3 when seasonal demand dips' },
        { num: '3', bold: 'Comparable printout',     rest: ' — Show the landlord actual RERA-registered transactions' },
      ],
    },
    {
      icon: '⚠️', title: 'Common Mistakes',
      tips: [
        { num: '✗', bold: "Don't lowball below 8%",     rest: " — Landlords disengage; aim for 5–7% below asking" },
        { num: '✗', bold: "Don't show desperation",     rest: " — Never say \"this is my favourite property\"" },
        { num: '✗', bold: "Don't skip RERA check",      rest: " — Always verify ownership before negotiating" },
      ],
    },
  ];

  chequePills: ChequePill[] = [
    { num: '1',  label: 'Cheque',   save: 'Save AED 8,000–10,000',     type: 'best' },
    { num: '2',  label: 'Cheques',  save: 'Save AED 5,000–7,000',      type: 'good' },
    { num: '4',  label: 'Cheques',  save: 'Standard — no discount',    type: 'ok'   },
    { num: '12', label: 'Cheques',  save: '+AED 3,000–5,000 premium',  type: 'bad'  },
  ];
}
