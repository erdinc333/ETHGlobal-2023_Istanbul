import { EEventStatuses } from "../enums/events.enum"

type TCreateEventPayload = Omit<TEvent, 'id'>

export class Event implements TEvent {
  id: string
  authorAddress: string
  title: string
  description: string
  location: string
  dateTimeRange: TDateTimeRange
  status: EEventStatuses

  constructor(payload: TCreateEventPayload, id: string) {
    this.id = id
    this.authorAddress = payload.authorAddress
    this.title = payload.title
    this.description = payload.description
    this.location = payload.location
    this.dateTimeRange = payload.dateTimeRange
    this.status = payload.status
  }


}