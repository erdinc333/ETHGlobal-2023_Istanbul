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
    console.log("🚀 ~ file: Tickets.data.ts:19 ~ TicketsData ~ getMyTickets ~ ticketFromBlockchainRow:", ticketFromBlockchainRaw)





    const tickets = ticketFromBlockchainRaw.map((ticketFromBlochain) => {
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
    })
    console.log("🚀 ~ file: Tickets.data.ts:32 ~ TicketsData ~ tickets ~ tickets:", tickets)

    return tickets
    
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
}