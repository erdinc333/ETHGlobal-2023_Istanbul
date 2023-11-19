import { Client } from "@web3-storage/w3up-client"
import { EEventStatuses } from "../../assets/enums/events.enum"
import { uploadFile } from "../../lib/IPFS/ipfs_client"
import { fetchAllEvents, fetchOneEvent } from "../../utils/graphDataFetcher"
import { fetchFileCID } from "../../utils/fetchIPFS"

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
    status: EEventStatuses.ACTIVE,
    tickets: []
  }
]

const convertFetchedEventToTEvent = async (fetchedEvent: TEventFromBlockchain): Promise<TEvent> => {
  const event = await fetchFileCID(fetchedEvent.jsonCID)
  event.id = fetchedEvent.eventId.toString()
  event.dateTimeRange.begin = new Date(event.dateTimeRange.begin)
  event.dateTimeRange.end = new Date(event.dateTimeRange.end)
  return event
}

export class EventsData {
  static async getAllEvents(): Promise<TEvent[]> {
    const allEventInBlockchain = await fetchAllEvents()
    console.log("🚀 ~ file: Events.data.ts:26 ~ EventsData ~ getAllEvents ~ allEventInBlockchain:", allEventInBlockchain)

    const allEvents: TEvent[] = await Promise.all(allEventInBlockchain.map(async (event) => {
      const fetchedEvent = await fetchFileCID(event.jsonCID)

      fetchedEvent.id = event.eventId.toString()
      fetchedEvent.dateTimeRange.begin = new Date(fetchedEvent.dateTimeRange.begin)
      fetchedEvent.dateTimeRange.end = new Date(fetchedEvent.dateTimeRange.end)
      return fetchedEvent
    }))
    console.log("🚀 ~ file: Events.data.ts:32 ~ EventsData ~ allEvents ~ allEvents:", allEvents)

    return allEvents
  }

  static async getEventById(id: string): Promise<TEvent | null> {
    if (id === '') return EVENTS[0]

    const fetchedEvent = await fetchOneEvent(Number(id))
    const event = await convertFetchedEventToTEvent(fetchedEvent[0])

    return event
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