import './CheckSpecificEvent.scss'

import { useEffect, useState } from "react"
import { handleData } from "../../../hooks/use-data/handleData.hook"
import { useParams } from "react-router-dom"

export function CheckSpecificEvent() {
  const { id: eventId } = useParams() 
  const [event, setEvent] = useState<TEvent | null>(null)

  useEffect(() => {
    async function fetchData() {
      const wantedEvent = await handleData().events.getEventById(eventId || '')
      
      setEvent(wantedEvent)
    }

    fetchData()

  }, [eventId])

  return (
    <>
      <section id="check-specific-event" className="page">
        {
          event
            ? <section className="catch" style={{ backgroundImage: "url(" + event.picturesURL[0] + ")" }}>
                <div className="titles">
                  <h1>{event?.title}</h1>
                </div>
              </section>
            : <p className="not-found">Event not found</p>
        }
        
      </section>
    </>
  )
}