import { EEventStatuses } from "../assets/enums/events.enum"

export {}

declare global {
  type TPrice = number
  
  type TDateTimeRange = {
    begin: Date
    end: Date
  }

  type TEvent = {
    id: string
    authorAddress: string
    title: string
    description: string
    location: string
    dateTimeRange: TDateTimeRange
    status: EEventStatuses
    picturesURL: string[]
  }

  type TTicketCategory = {
    label: string,
    supply: number
  }

  type TTicket = {
    id: string
    eventId: string
    transferFees: number
    description: string
    price: TPrice
  }


}