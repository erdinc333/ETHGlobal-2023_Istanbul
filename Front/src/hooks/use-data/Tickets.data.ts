import { EEventStatuses } from "../../assets/enums/events.enum"
import { EventsData } from "./Events.data"

const TICKETS: TTicket[] = [
  {
    id: '1',
    eventId: '1',
    templateId: '1',
    issuerAddress: '1',
    selectedOptions: [
      {
        parameterLabel: 'Duration',
        option: {
          value: '2h',
          price: 18,
          maxSupply: 50,
          currentSupply: 23,
        }
      }
    ],
    getPrice: function () { return this.selectedOptions.reduce((prev, current) => prev + current.option.price, 0) }
  }
]

const TICKET_TEMPLATES: TTicketTemplate[] = [
  {
    id: '1',
    eventId: '1',
    issuerAddress: '1',
    templateName: 'base-ticket',
    parameters: [
      {
        label: 'Duration',
        options: [
          {
            value: '1h',
            price: 10,
            maxSupply: 50,
            currentSupply: 42,
          },
          {
            value: '2h',
            price: 18,
            maxSupply: 50,
            currentSupply: 23,
          }
        ],
        toSelectedOption: function (selectedOptionValue: string): TTicketSelectedOption | null {
          const option = this.options.find((_option) => _option.value === selectedOptionValue)
          if (!option) return null

          return {
            parameterLabel: this.label,
            option: option
          }
        }
      }
    ],
    transferFees: 2,
    maxSupply: 100,
    currentSupply: 65,
    createTicket: function (selectedOptions: TTicketSelectedOption[]): Omit<TTicket, 'id'> | null {
      const confirmedSelectedOptions = selectedOptions.map((selectedOption) => this.parameters.find((param) => param.label === selectedOption.parameterLabel)?.toSelectedOption(selectedOption.option.value)).filter((option) => !!option)
      if (confirmedSelectedOptions.length !== selectedOptions.length) return null

      return {
        eventId: this.eventId,
        templateId: this.id,
        issuerAddress: this.issuerAddress,
        selectedOptions: confirmedSelectedOptions as TTicketSelectedOption[],
        getPrice: function () { return this.selectedOptions.reduce((prev, current) => prev + current.option.price, 0) }
      }
    },
  }
]

type TCreateTicketTemplatePayload = {
  eventId: string
  issuerAddress: string
  templateName: string
  parameters: Array<Omit<TTicketParameter, 'currentSupply'>>
  transferFees: number
  maxSupply: number
}
type TUpdateTicketTemplatePayload = {
  id: string
  templateName: string
  parametersToAdd: Array<Omit<TTicketParameter, 'currentSupply'>>
  transferFees: number
  maxSupply: number
}

export class TicketsData {
  static async getAllEventTickets(eventId: string): Promise<TTicket[]> {
    return TICKETS.filter((ticket) => ticket.eventId === eventId)
  }

  static async getTicketById(id: string): Promise<TTicket | null> {
    return TICKETS.find((ticket) => ticket.id === id) || null
  }

  static async createTicketFromTemplate(templateId: string, selectedOptions: TTicketSelectedOption[]): Promise<TTicket | null> {
    const template = TICKET_TEMPLATES.find((_template) => _template.id === templateId)
    if (!template) return null

    const newTicket = template.createTicket(selectedOptions)
    if (!newTicket) return null

    const indexedTicket: TTicket = { ...newTicket, id: String(TICKETS.length + 1)} 
    TICKETS.push(indexedTicket)

    return indexedTicket
  }

  static async createTicketTemplate(payload: TCreateTicketTemplatePayload): Promise<TTicketTemplate> {
    if (payload.maxSupply < -1) throw new Error('Max supply must be positive, or -1 for unlimited')

    const invalidOption = payload.parameters.some((param) => param.options.some((_option) => _option.price < 0))
    if (invalidOption) throw new Error('Options price must be positive')

    const relatedEvent = await EventsData.getEventById(payload.eventId)
    if (!relatedEvent) throw new Error('Event not found')
    if (relatedEvent.status === EEventStatuses.CANCELED) throw new Error('Cannot create template for canceled event')


    const template: TTicketTemplate = {
      id: String(TICKET_TEMPLATES.length + 1),
      ...payload,
      parameters: payload.parameters.map((param) => ({ ...param, currentSupply: 0 })),
      currentSupply: 0,
      createTicket: function (selectedOptions: TTicketSelectedOption[]): Omit<TTicket, 'id'> | null {
        const confirmedSelectedOptions = selectedOptions.map((selectedOption) => this.parameters.find((param) => param.label === selectedOption.parameterLabel)?.toSelectedOption(selectedOption.option.value)).filter((option) => !!option)
        if (confirmedSelectedOptions.length !== selectedOptions.length) return null
  
        return {
          eventId: this.eventId,
          templateId: this.id,
          issuerAddress: this.issuerAddress,
          selectedOptions: confirmedSelectedOptions as TTicketSelectedOption[],
          getPrice: function () { return this.selectedOptions.reduce((prev, current) => prev + current.option.price, 0) }
        }
      },
    }

    TICKET_TEMPLATES.push(template)

    return template
  }

  static async updateTicketTemplate(payload: TUpdateTicketTemplatePayload): Promise<TTicketTemplate> {
    const invalidOption = payload.parametersToAdd.some((param) => param.options.some((_option) => _option.price < 0))
    if (invalidOption) throw new Error('Options price must be positive')

    const currentTemplateIndex = TICKETS.findIndex((event) => event.id === payload.id)
    if (currentTemplateIndex < 0)
      throw new Error('Template not found')

    const currentTemplate = TICKET_TEMPLATES[currentTemplateIndex]
    if (payload.maxSupply < currentTemplate.currentSupply) throw new Error('Max supply cannot be less than current supply')

    
  
    const updatedTemplate: TTicketTemplate = {
      ...currentTemplate,
      templateName: payload.templateName || currentTemplate.templateName,
      parameters: currentTemplate.parameters.concat(payload.parametersToAdd.map((param) => ({ ...param, currentSupply: 0 }))),
      transferFees: payload.transferFees ?? currentTemplate.transferFees,
      maxSupply: payload.maxSupply ?? currentTemplate.maxSupply,
    }

    TICKET_TEMPLATES.splice(currentTemplateIndex, 1, updatedTemplate)

    return updatedTemplate
  }
}