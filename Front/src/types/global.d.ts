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
    tickets: TTicketCategory[]
  }

  type TTicketModalType = 'buy' | 'use' | 'sell'

  type TEventFromBlockchain = {
      id?: string,
      eventId: number,
      jsonCID: string,
      date: number,
      ticketIds: number[]
  }

  type TCreateEventPayload = { tickets: TTicketCategory[] } & Omit<TEvent, 'id'>
  type TUpdateEventPayload = { id: string } & Partial<Omit<TEvent, 'authorAddress'>>

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

  type TTicketCreationPayload = {
    quantity: number,
    description: string,
  }

  type TTicket = {
    id: string
    eventId: string
    description: string
    price: TPrice
  }


}