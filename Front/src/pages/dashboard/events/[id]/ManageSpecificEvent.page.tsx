import './ManageSpecificEvent.scss'

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { handleData } from '../../../../hooks/use-data/handleData.hook'

export function ManageSpecificEvent() {
  const { id: eventId } = useParams() 
  const [event, setEvent] = useState<TEvent | null>(null)
  const [eventTickets, setEventTickets] = useState<TTicket[]>([])
  const [tmpBegin, setTmpBegin] = useState<string>('')
  const [tmpEnd, setTmpEnd] = useState<string>('')

  function dateToDatetimeString(date: Date | null | undefined): string {
    if (!date) return ''
    return (new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString()).slice(0, -1)
  }

  function handleBeginUpdate(event: React.ChangeEvent<HTMLInputElement>) {
    setEvent((curr) => {
      const newDate = new Date(Date.parse(event.target.value))
      setTmpBegin(dateToDatetimeString(newDate))
      return (curr ? { ...curr, dateTimeRang: { begin: newDate, end: curr.dateTimeRange.end } } : null)
    })
  }
  function handleEndUpdate(event: React.ChangeEvent<HTMLInputElement>) {
    setEvent((curr) => {
      const newDate = new Date(Date.parse(event.target.value))
      setTmpEnd(dateToDatetimeString(newDate))
      return (curr ? { ...curr, dateTimeRang: { end: newDate, begin: curr.dateTimeRange.begin } } : null)
    })
  }

  function updateEvent() {
    if (!event) return
    handleData().events.updateEvent(event)
  }

  useEffect(() => {
    async function fetchData() {
      const wantedEvent = await handleData().events.getEventById(eventId || '')
      setEvent(wantedEvent)

      setTmpBegin(dateToDatetimeString(wantedEvent?.dateTimeRange.begin))
      setTmpEnd(dateToDatetimeString(wantedEvent?.dateTimeRange.end))

      const tickets = await handleData().tickets.getAllEventTickets(eventId || '')
      setEventTickets(tickets)
    }

    fetchData()

  }, [eventId])

  return (
    <>
      <section id="manage-specific-event" className="page">
        {
          event
            ? <>
                <section className="catch" style={{ backgroundImage: "url(" + event.picturesURL[0] + ")" }}>
                  <div className="titles">
                    <input className="input" type="text" value={event.title} onChange={(event) => setEvent((curr) => (curr ? { ...curr, title: event.target.value } : null))} />
                  </div>
                </section>

                <section className="info">
                  <div className="meta">
                    <input className="input-location" type="text" value={event.location} onChange={(event) => setEvent((curr) => (curr ? { ...curr, location: event.target.value } : null))} />
                    <div className="time">
                      <input className="input-time" type="datetime-local" value={tmpBegin} onChange={handleBeginUpdate} />
                      <input className="input-time" type="datetime-local" value={tmpEnd} onChange={handleEndUpdate} />
                    </div>
                  </div>
                  <textarea className="input" value={event.description} onChange={(event) => setEvent((curr) => (curr ? { ...curr, description: event.target.value } : null))} />
                  <button className="btn action" onClick={updateEvent}>Update Event</button>
                </section>

                <section className="market-place">
                  <h2>Market Place</h2>
                  <div className="tickets">
                    { eventTickets.length }
                  </div>
                </section>
              </>
            : <p className="not-found">Event not found</p>
        }
        
      </section>
    </>
  )
}