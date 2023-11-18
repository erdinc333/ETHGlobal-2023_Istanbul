import { Client } from "@web3-storage/w3up-client"
import { EEventStatuses } from "../../assets/enums/events.enum"
import { uploadFile } from "../../lib/IPFS/ipfs_client"

const EVENTS: TEvent[] = [
  {
    id: '1',
    authorAddress: '1',
    title: 'My First Event',
    description: 'A super cool event',
    location: 'A random address',
    dateTimeRange: {
      begin: new Date('2025-01-15'),
      end: new Date('2025-01-30'),
    },
    picturesURL: ['https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D'],
    status: EEventStatuses.ACTIVE
  }
]

export class EventsData {
  static async getAllEvents(): Promise<TEvent[]> {
    return EVENTS
  }

  static async getEventById(id: string): Promise<TEvent | null> {
    return EVENTS.find((event) => event.id === id) || null
  }

  static async updateEvent(payload: TUpdateEventPayload): Promise<TEvent> {
    const currentEventIndex = EVENTS.findIndex((event) => event.id === payload.id)
    
    if (currentEventIndex < 0)
      throw new Error('Event not found')

    const currentEvent = EVENTS[currentEventIndex]
    if (currentEvent.status === EEventStatuses.CANCELED)
      throw new Error('Cannot update canceled event')
    if (currentEvent.dateTimeRange.begin < new Date() && (payload.dateTimeRange || payload.location))
      throw new Error('Cannot update date or location of already started event')
  
    const updatedEvent = {
      id: currentEvent.id,
      authorAddress: currentEvent.authorAddress,
      title: payload.title || currentEvent.title,
      description: payload.description || currentEvent.description,
      location: payload.location || currentEvent.location,
      dateTimeRange: payload.dateTimeRange || currentEvent.dateTimeRange,
      picturesURL: payload.picturesURL || currentEvent.picturesURL,
      status: currentEvent.status,
    }

    EVENTS.splice(currentEventIndex, 1, updatedEvent)

    return updatedEvent
  }

  static async activateEvent(id: string): Promise<TEvent> {
    const event = EVENTS.find((event) => event.id === id)
    if (!event) throw new Error('Event not found')
    if (event.status === EEventStatuses.CANCELED) throw new Error('Cannot update canceled event')

    event.status = EEventStatuses.ACTIVE

    return event
  }

  static async cancelEvent(id: string): Promise<TEvent> {
    const event = EVENTS.find((event) => event.id === id)
    if (!event) throw new Error('Event not found')
    
    event.status = EEventStatuses.CANCELED

    return event
  }
}