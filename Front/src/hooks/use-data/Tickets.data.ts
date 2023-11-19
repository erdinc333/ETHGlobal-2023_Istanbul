import { fetchMyTickets } from "../../utils/graphDataFetcher"

const TICKETS: TTicket[] = [
  {
    id: '1',
    eventId: '1',
    description: "1 hour",
    price: 18
  }
]

export class TicketsData {
  static async getAllEventTickets(eventId: string): Promise<TTicket[]> {
    return TICKETS.filter((ticket) => ticket.eventId === eventId)
  }

  static async getMyTickets(userAddress: string): Promise<TTicket[]> {
    
    const ticketFromBlockchainRaw: TTicketFromBlockchain[] = await fetchMyTickets(userAddress)

    const uniqueTicketIds = Array.from(new Set(ticketFromBlockchainRaw.map((ticket) => ticket.ticketId)))
    const lastEntryOfIds: TTicket[] = []
    
    for (const ticketId of uniqueTicketIds) {
      const ticketEntries = ticketFromBlockchainRaw.filter((ticket) => ticket.ticketId === ticketId)
      ticketEntries.sort((t1, t2) => t1.blockTimestamp > t2.blockTimestamp ? -1 : 1)

      lastEntryOfIds.push(TicketsData.getTicketFromRawBlockchain(ticketEntries[0]))
    }


    return lastEntryOfIds
    
    // return TICKETS
  }

  static async getTicketById(id: string): Promise<TTicket | null> {
    return TICKETS.find((ticket) => ticket.id === id) || null
  }

  static async getEventTicketCategories(eventId: string): Promise<TTicketCategory[]> {
    return [{ label: TICKETS[0].description, supply: 1, transferFees: 10 }]
  }

  static async getEventTicketCategory(categoryId: string): Promise<TTicketCategory> {
    return { label: TICKETS[0].description, supply: 1, transferFees: 10 }
  }

  private static getTicketFromRawBlockchain(ticketFromBlochain: TTicketFromBlockchain): TTicket {
    let description = ""

    if (ticketFromBlochain.ticketId == 0)
      description = '1 hour'
    if (ticketFromBlochain.ticketId == 1)
      description = '2 hour'
    if (ticketFromBlochain.ticketId == 2)
      description = '3 hour'

    const ticket: TTicket = {
      eventId: ticketFromBlochain.eventIdOfTicket.toString(),
      description: description,
      id: ticketFromBlochain.ticketId.toString(),
      price: 0,
      supply: ticketFromBlochain.quantity
    }

    return ticket
  }
}