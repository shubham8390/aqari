import { Injectable, signal } from '@angular/core';
import { ChatMessage } from '../models/message.model';
import { PROPERTIES, NEGOTIATION_DATA } from '../data/properties.data';

const QUICK_REPLIES: Record<string, string> = {
  'Draft the negotiation message for me':
    `Here's your ready-to-send negotiation message:<br><br><em>"Dear [Broker Name], we are very interested in the Marina Gate II unit on Floor 18. After reviewing RERA-registered comparables, we'd like to propose <strong>AED 110,000/year paid in 2 cheques</strong>. We can sign and complete Ejari registration within 2 weeks."</em><br><br>Personalise with the broker's name then send. Shall I prepare your <strong>documents checklist</strong> next?`,

  'What documents do I need to rent in Dubai?':
    `To rent in Dubai you'll need:<br><br><strong>1. Emirates ID</strong> — front &amp; back ✓<br><strong>2. Passport copy</strong> — valid ✓<br><strong>3. Visa copy</strong> — UAE residence visa ✓<br><strong>4. Security deposit</strong> — 5% of annual rent (AED 5,750)<br><strong>5. Signed tenancy contract</strong> — RERA standard form<br><strong>6. Ejari registration</strong> — AED 220 fee, mandatory by law<br><br>Your first 3 are already ready. Want me to walk you through the <strong>Ejari process</strong> step by step?`,

  'Show Marina market trends':
    `<strong>Dubai Marina Rental Trends — Q1 2025:</strong><br><br>• 2BHK average: AED 109,500/yr (+4.2% YoY)<br>• Occupancy rate: 94% — very tight supply<br>• Top floors (18–30): 8–12% premium<br>• Post-2018 buildings: +5–7% vs older stock<br>• Best window: units listed 30+ days<br><br>Your target unit at AED 115K is <strong>5% above market avg</strong> — good room to negotiate.`,

  'How does Ejari registration work?':
    `<strong>Ejari</strong> is mandatory for all Dubai tenancies (RERA law).<br><br><strong>Steps:</strong><br>1. Sign tenancy contract<br>2. Collect: contract, EID copies, title deed, DEWA proof<br>3. Register on Ejari app or at any typing center<br>4. Pay AED 220 fee<br>5. Receive certificate instantly<br><br>Without Ejari you cannot connect utilities or access government services. Want to open the <strong>full Ejari guide</strong>?`,

  'Schedule a property viewing for Marina Gate II':
    `I'll coordinate a viewing for <strong>Marina Gate II, Floor 18</strong>.<br><br>Available slots:<br>• <strong>Tomorrow</strong> — 10:00 AM or 3:00 PM<br>• <strong>Friday</strong> — 11:00 AM (weekend, relaxed visit)<br><br>Which works best? I'll confirm with the broker and prepare a <strong>property inspection checklist</strong> so you miss nothing.`,
};

@Injectable({ providedIn: 'root' })
export class ChatService {
  messages = signal<ChatMessage[]>(this.buildInitialMessages());
  isTyping  = signal(false);

  sendMessage(text: string): void {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id:   Date.now().toString(),
      role: 'user',
      text,
      time: 'Just now',
    };
    this.messages.update(msgs => [...msgs, userMsg]);
    this.isTyping.set(true);

    setTimeout(() => {
      this.isTyping.set(false);
      const replyText = QUICK_REPLIES[text]
        ?? `I understand — <em>"${text}"</em>.<br><br>I'm cross-referencing <strong>RERA live data</strong> and the latest listings to personalise my guidance. Could you share a bit more context?`;

      const agentMsg: ChatMessage = {
        id:   (Date.now() + 1).toString(),
        role: 'agent',
        text: replyText,
        time: 'Just now · Agent Zayed',
      };
      this.messages.update(msgs => [...msgs, agentMsg]);
    }, 1600);
  }

  private buildInitialMessages(): ChatMessage[] {
    return [
      {
        id: '1',
        role: 'agent',
        text: `مرحباً — Welcome, Ahmed. I'm Agent Zayed, your dedicated Dubai property AI.<br><br>I have access to <strong>real-time listings, RERA data, and market analytics</strong> across all Dubai districts. I'll guide you from your first search all the way to handing over the keys.<br><br>Tell me what you're looking for.`,
        time: '10:02 AM · Today',
      },
      {
        id: '2',
        role: 'user',
        text: 'Looking to rent a furnished 2BHK in Dubai Marina. Budget AED 120,000/year. Sea views, modern building post-2018.',
        time: '10:03 AM',
      },
      {
        id: '3',
        role: 'agent',
        text: `Excellent taste — Marina post-2018 gives you the best amenities and views. I've scanned <strong>847 active listings</strong> and shortlisted the top 3:`,
        time: '10:03 AM · Searched 847 listings in 2.1s',
        contentType: 'property-list',
        properties: PROPERTIES,
      },
      {
        id: '4',
        role: 'user',
        text: 'Yes, let\'s go with Marina Gate II. Can I negotiate it down?',
        time: '10:05 AM',
      },
      {
        id: '5',
        role: 'agent',
        text: `Good move. Here's the full negotiation picture based on <strong>RERA transaction data</strong>:`,
        time: '10:06 AM · RERA data + 90-day analysis',
        contentType: 'negotiation-card',
        negotiation: NEGOTIATION_DATA,
      },
    ];
  }
}
