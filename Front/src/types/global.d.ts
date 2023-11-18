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

  type TEventCreationPayload = {
    authorAddress: string
    title: string
    description: string
    location: string
    dateTimeRange: TDateTimeRange
    status: EEventStatuses
    picturesURL: string[]
    tickets: TTicketCategory[]
  }

  type TTicketCategory = {
    label: string,
    supply: number,
    transferFees: number
  }

  type TTicket = {
    id: string
    eventId: string
    description: string
    price: TPrice
  }


}