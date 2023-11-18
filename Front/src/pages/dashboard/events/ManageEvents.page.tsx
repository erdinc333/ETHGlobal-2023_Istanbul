import './ManageEvents.scss'

import { useEffect, useState } from "react"
import { handleData } from "../../../hooks/use-data/handleData.hook"
import { EventCard } from "../../../components/events/event-card/EventCard.component"

export function ManageEvents() {
  const [events, setEvents] = useState<TEvent[]>([])

  useEffect(() => {
    async function fetchData() {
      const allEvents = await handleData().events.getAllEvents()
      
      setEvents(allEvents)
    }

    fetchData()

  }, [])
  
  return (
    <>
      <section id="manage-events" className="page">
        <h2>Manage my events</h2>

        <div className="events">
          { events.map((event) => <EventCard event={event} key={event.id} />) }
        </div>
      </section>
    </>
  )
}