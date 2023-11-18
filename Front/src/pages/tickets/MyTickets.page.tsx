import './MyTickets.scss'

import { useEffect, useState } from "react"
import { handleData } from '../../hooks/use-data/handleData.hook'
import { Ticket } from '../../components/tickets/Ticket.component'

type TEventTitle = string
type TTicketCategory = string

export function MyTickets() {
  const [myTicketsPerEvent, setMyTicketsPerEvent] = useState<Record<TEventTitle, Record<TTicketCategory,  TTicket[]>>>({})

  useEffect(() => {
    async function fetchData() {
      const tickets = await handleData().tickets.getMyTickets()
      const allUniqueEventIds = Array.from(new Set(tickets.map((ticket) => ticket.eventId)))

      const ticketsPerEvent: Record<TEventTitle, Record<TTicketCategory, TTicket[]>> = {}
      for (const eventId of allUniqueEventIds) {
        const event = await handleData().events.getEventById(eventId)
        const eventCategories = await handleData().tickets.getEventTicketCategories(eventId)
        const eventTickets = tickets.filter((_ticket) => _ticket.eventId === eventId)
        ticketsPerEvent[event?.title || 'Unknown Event'] = {}

        for (const category of eventCategories) {
          const ticketsOfCategory = eventTickets.filter((_ticket) => _ticket.description === category.label)
          ticketsPerEvent[event?.title || 'Unknown Event'][category.label] = ticketsOfCategory
        }
      }

      console.log({ ticketsPerEvent })

      setMyTicketsPerEvent(ticketsPerEvent)
    }

    fetchData()

  }, [])

  return (
    <>
      <section id="my-tickets" className="page">
        {
          event
            ? <>
                <section className="catch">
                  <div className="titles">
                    <h1>My Tickets</h1>
                  </div>
                </section>

                <section className="tickets-list">
                  <h2>Tickets per event</h2>
                  <div className="events">
                    {
                      Object.entries(myTicketsPerEvent).map(([eventTitle, categories]) => {
                        return (
                          <div className="event">
                            <h3>{eventTitle}</h3>

                            <div className="tickets">
                              {
                                Object.values(categories).map((tickets) => <Ticket  owned={true} ticket={tickets[0]} key={tickets[0].id} amount={tickets.length} />)
                              }
                            </div>
                          </div>
                        )
                      })
                    }
                    {
                      Object.entries(myTicketsPerEvent).map(([eventTitle, categories]) => {
                        return (
                          <div className="event">
                            <h3>{eventTitle}</h3>

                            <div className="tickets">
                              {
                                Object.values(categories).map((tickets) => <Ticket  owned={true} ticket={tickets[0]} key={tickets[0].id} amount={tickets.length} />)
                              }
                            </div>
                          </div>
                        )
                      })
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