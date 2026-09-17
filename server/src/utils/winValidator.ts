import { WinningCategory } from '../types';

export function validateWinClaim(
  tickets: (number | null)[][][],
  calledNumbersSet: Set<number>,
  category: WinningCategory,
  specificTicketIndex?: number
): { valid: boolean; reason?: string; ticketIndex?: number; winningTicket?: (number | null)[][] } {
  const getRowNumbers = (ticket: (number | null)[][], rowIdx: number): number[] => {
    return (ticket[rowIdx] || []).filter((n): n is number => n !== null);
  };

  const checkTicket = (ticket: (number | null)[][], tIdxLabel: number): { valid: boolean; reason?: string } => {
    const allTicketNumbers: number[] = [];
    ticket.forEach(row => {
      row.forEach(cell => {
        if (cell !== null) allTicketNumbers.push(cell);
      });
    });

    const calledOnTicket = allTicketNumbers.filter(n => calledNumbersSet.has(n));

    switch (category) {
      case 'earlyFive': {
        if (calledOnTicket.length >= 5) {
          return { valid: true };
        }
        return {
          valid: false,
          reason: `Ticket #${tIdxLabel} requires at least 5 called numbers. You currently have ${calledOnTicket.length}.`,
        };
      }

      case 'topLine': {
        const topRow = getRowNumbers(ticket, 0);
        const missing = topRow.filter(n => !calledNumbersSet.has(n));
        if (missing.length === 0) {
          return { valid: true };
        }
        return {
          valid: false,
          reason: `Ticket #${tIdxLabel} Top Line incomplete. Missing called number(s): ${missing.join(', ')}.`,
        };
      }

      case 'middleLine': {
        const midRow = getRowNumbers(ticket, 1);
        const missing = midRow.filter(n => !calledNumbersSet.has(n));
        if (missing.length === 0) {
          return { valid: true };
        }
        return {
          valid: false,
          reason: `Ticket #${tIdxLabel} Middle Line incomplete. Missing called number(s): ${missing.join(', ')}.`,
        };
      }

      case 'bottomLine': {
        const botRow = getRowNumbers(ticket, 2);
        const missing = botRow.filter(n => !calledNumbersSet.has(n));
        if (missing.length === 0) {
          return { valid: true };
        }
        return {
          valid: false,
          reason: `Ticket #${tIdxLabel} Bottom Line incomplete. Missing called number(s): ${missing.join(', ')}.`,
        };
      }

      case 'fullHouse': {
        const missing = allTicketNumbers.filter(n => !calledNumbersSet.has(n));
        if (missing.length === 0) {
          return { valid: true };
        }
        return {
          valid: false,
          reason: `Ticket #${tIdxLabel} Full House requires all 15 numbers to be called. Missing ${missing.length} number(s): ${missing.join(', ')}.`,
        };
      }

      default:
        return { valid: false, reason: 'Unknown winning category.' };
    }
  };

  // If user selected a specific ticket (e.g. Ticket #1 or Ticket #2)
  if (specificTicketIndex !== undefined && specificTicketIndex >= 0 && specificTicketIndex < tickets.length) {
    const targetTicket = tickets[specificTicketIndex];
    const res = checkTicket(targetTicket, specificTicketIndex + 1);
    if (res.valid) {
      return {
        valid: true,
        ticketIndex: specificTicketIndex,
        winningTicket: targetTicket,
      };
    }
    return { valid: false, reason: res.reason };
  }

  // Otherwise search across all tickets
  let lastReason = 'No tickets available.';
  for (let tIdx = 0; tIdx < tickets.length; tIdx++) {
    const res = checkTicket(tickets[tIdx], tIdx + 1);
    if (res.valid) {
      return {
        valid: true,
        ticketIndex: tIdx,
        winningTicket: tickets[tIdx],
      };
    }
    lastReason = res.reason || lastReason;
  }

  return { valid: false, reason: lastReason };
}
