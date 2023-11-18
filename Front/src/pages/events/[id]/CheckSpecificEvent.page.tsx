import './CheckSpecificEvent.scss'

import { useEffect, useState } from "react"
import { handleData } from "../../../hooks/use-data/handleData.hook"
import { useParams } from "react-router-dom"
import { Ticket } from '../../../components/tickets/Ticket.component'

export function CheckSpecificEvent() {
  const { id: eventId } = useParams() 
  const [event, setEvent] = useState<TEvent | null>(null)
  const [eventTickets, setEventTickets] = useState<TTicket[]>([])

  useEffect(() => {
    async function fetchData() {
      const wantedEvent = await handleData().events.getEventById(eventId || '')
      setEvent(wantedEvent)

      const tickets = await handleData().tickets.getAllEventTickets(eventId || '')
      setEventTickets(tickets)
    }

    fetchData()

  }, [eventId])

  return (
    <>
      <section id="check-specific-event" className="page">
        {
          event
            ? <>
                <section className="catch" style={{ backgroundImage: "url(" + event.picturesURL[0] + ")" }}>
                  <div className="titles">
                    <h1>{event?.title}</h1>
                  </div>
                </section>

                <section className="info">
                  <div className="meta">
                    <small>{event.location}</small>
                    <small>{ event.dateTimeRange.begin.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric', hour: 'numeric', minute: "numeric"}) } - { event.dateTimeRange.end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric', hour: 'numeric', minute: "numeric"}) }</small>
                  </div>
                  <h3 className="description">{event.description}</h3>
                </section>

                <section className="market-place">
                  <h2>Market Place</h2>
                  <div className="tickets">
                    {
                      eventTickets.map((ticket) => <Ticket ticket={ticket} key={ticket.id} />)
                    }
                  </div>
                </section>
              </>
            : <p className="not-found">Event not found</p>
        }
        
      </section>
    </>
  )
}