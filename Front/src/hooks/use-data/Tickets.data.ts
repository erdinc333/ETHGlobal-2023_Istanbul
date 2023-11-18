const TICKETS: TTicket[] = [
  {
    id: '1',
    eventId: '1',
    description: "1 hour",
    transferFees: 10,
    price: 18
  }
]

export class TicketsData {
  static async getAllEventTickets(eventId: string): Promise<TTicket[]> {
    return TICKETS.filter((ticket) => ticket.eventId === eventId)
  }

  static async getMyTickets(): Promise<TTicket[]> {
    return TICKETS
  }

  static async getTicketById(id: string): Promise<TTicket | null> {
    return TICKETS.find((ticket) => ticket.id === id) || null
  }

  static async getEventTicketCategories(eventId: string): Promise<TTicketCategory[]> {
    return [{ label: TICKETS[0].description, supply: 1 }]
  }
}