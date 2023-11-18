import { useEffect, useState } from 'react'
import { handleData } from '../../hooks/use-data/handleData.hook'
import './AllEvents.scss'
import { EventResume } from '../../components/events/event-resume/EventResume.component'

export function AllEvents() {
  
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
      <section id="all-events" className="page">
        <section className="catch">
          <div className="titles">
            <h1>An event for every occasion</h1>
          </div>
        </section>

        <section className="all-events">
          { events.map((event) => <EventResume event={event} />) }
        </section>
      </section>
    </>
  )
}