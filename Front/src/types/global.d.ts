import { EEventStatuses } from "../assets/enums/events.enum"

export {}

declare global {
  type TPrice = number
  type TOption = {
    value: string,
    price: TPrice
    maxSupply: number
    currentSupply: number
  }
  
  type TDateTimeRange = {
    begin: date
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

  type TTicketParameter = {
    label: string
    options: TOption[]
    toSelectedOption: (selectedOptionValue: string) => TTicketSelectedOption | null
  }

  type TTicketSelectedOption = {
    parameterLabel: string
    option: TOption
  }

  type TTicketTemplate = {
    id: string
    eventId: string
    issuerAddress: string
    templateName: string
    parameters: TTicketParameter[]
    transferFees: number
    maxSupply: number
    currentSupply: number
    createTicket: (selectedOptions: TTicketSelectedOption[]) => Omit<TTicket, 'id'> | null
  }

  type TTicket = {
    id: string
    eventId: string
    templateId: string
    issuerAddress: string
    selectedOptions: TTicketSelectedOption[]
    getPrice: () => TPrice
  }


}