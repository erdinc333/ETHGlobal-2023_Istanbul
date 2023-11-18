
import './BurnTicket.scss'

import { useEffect, useState } from "react"
import { handleData } from "../../../hooks/use-data/handleData.hook"
import { useSearchParams } from 'react-router-dom'


export function BurnTicket() {
  const [searchParams] = useSearchParams()

  const [event, setEvent] = useState<TEvent | null>(null)
  const [category, setCategory] = useState<TTicketCategory | null>(null)
  // const [open, setOpen] = useState<boolean>(false)

  
  const clientSignature = searchParams.get('client-signature')
  const ticketCategoryId = searchParams.get('ticket-category-id')
  const eventId = searchParams.get('event-id')
  const amount = searchParams.get('amount')

  function burn() {}

  useEffect(() => {
    async function fetchData() {
      const event = await handleData().events.getEventById(eventId || '')
      const category = await handleData().tickets.getEventTicketCategory(ticketCategoryId || '')

      setEvent(event)
      setCategory(category)
    }

    fetchData()

  }, [eventId, ticketCategoryId])
  
  return (
    <>
      <section id="burn-ticket" className="page">

        <section className="catch">
          <div className="titles">
            <h1>Use Ticket</h1>
          </div>
        </section>

        <div className="use-ticket">
          <h2>{ event?.title}</h2>
          <table>
            <tr>
              <td className="data-type">Ticket type:</td>
              <td>{category?.label}</td>
            </tr>
            <tr>
              <td className="data-type">Amount:</td>
              <td>{amount}</td>
            </tr>
          </table>
          <button className="burnt btn action" onClick={burn}>Use ticket</button>
        </div>

      </section>
    </>
  )
}