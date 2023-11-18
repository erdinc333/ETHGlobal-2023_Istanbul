import { EventsData } from "./Events.data";
import { TicketsData } from "./Tickets.data";


export function handleData() {
  return {
    events: EventsData,
    tickets: TicketsData
  }
}