import './ManageEvents.scss'

import { useEffect, useState } from "react"
import { handleData } from "../../../hooks/use-data/handleData.hook"
import { EventCard } from "../../../components/events/event-card/EventCard.component"
import { Modal } from '../../../components/global/modal/Modal.component'

type TCreateEvent = { title: string, description: string, location: string, dateTimeRange: TDateTimeRange }

export function ManageEvents() {
  const [events, setEvents] = useState<TEvent[]>([])
  const [newEvent, setNewEvent] = useState<TCreateEvent>({
    title: '', description: '', location: '', dateTimeRange: { begin: new Date(), end: new Date() }
  })
  const [tmpBegin, setTmpBegin] = useState<string>('')
  const [tmpEnd, setTmpEnd] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)

  function dateToDatetimeString(date: Date | null | undefined): string {
    if (!date) return ''
    return (new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString()).slice(0, -1)
  }

  function handleBeginUpdate(event: React.ChangeEvent<HTMLInputElement>) {
    setNewEvent((curr) => {
      const newDate = new Date(Date.parse(event.target.value))
      setTmpBegin(dateToDatetimeString(newDate))
      return { ...curr, dateTimeRange: { begin: newDate, end: curr.dateTimeRange.end }}
    })
  }
  function handleEndUpdate(event: React.ChangeEvent<HTMLInputElement>) {
    setNewEvent((curr) => {
      const newDate = new Date(Date.parse(event.target.value))
      setTmpEnd(dateToDatetimeString(newDate))
      return { ...curr, dateTimeRange: { end: newDate, begin: curr.dateTimeRange.begin } }
    })
  }

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

        <Modal open={open} setOpen={setOpen}>

          <div className="event-form">
            <input type="text" placeholder="Title" className="title" value={newEvent.title} onChange={(e) => setNewEvent((curr) => ({ ...curr, title: e.target.value }))} />
            <textarea className="description" placeholder="Description" value={newEvent.title} onChange={(e) => setNewEvent((curr) => ({ ...curr, title: e.target.value }))} />
            <input type="text" className="location" placeholder="Location" value={newEvent.title} onChange={(e) => setNewEvent((curr) => ({ ...curr, title: e.target.value }))} />
            <label htmlFor="begin">
              <span>Begin: </span>
              <input type="datetime-local" id="begin" placeholder="Begin" className="begin" value={tmpBegin} onChange={handleBeginUpdate} />
            </label>
            <label htmlFor="end">
              <span>End: </span>
              <input type="datetime-local" id="end" className="end" value={tmpEnd} onChange={handleEndUpdate} />
            </label>
          
            <button className="btn action">Create event</button>
          </div>

        </Modal>

        <h2>Manage my events</h2>

        <div className="events">
          { events.map((event) => <EventCard event={event} key={event.id} />) }
        </div>

        <button className="create-event btn action" onClick={() => setOpen(true)}>Create event</button>
      </section>
    </>
  )
}