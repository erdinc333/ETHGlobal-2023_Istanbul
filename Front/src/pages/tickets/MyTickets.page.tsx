import './MyTickets.scss'

import { useEffect, useState } from "react"
import { handleData } from '../../hooks/use-data/handleData.hook'
import { Ticket } from '../../components/tickets/Ticket.component'
import { Modal } from '../../components/global/modal/Modal.component'
import QRious from 'qrious';
import { signMessage } from '@wagmi/core'


type TEventTitle = string
type TTicketCategory = string

export function MyTickets() {
  const [myTicketsPerEvent, setMyTicketsPerEvent] = useState<Record<TEventTitle, Record<TTicketCategory,  TTicket[]>>>({})
  const [open, setOpen] = useState<boolean>(false)
  const [modalType, setModalType] = useState<TTicketModalType>('use')
  const [howManyTicketToPick, setHowManyTicketToPick] = useState<number>(0)
  const [ticketPrice, setTicketPrice] = useState<number>(0)
  const [signature, setSignature] = useState<string>('')

  function consumeTicket(type: TTicketModalType , ticket: TTicket, amount?: number) {
    setModalType(type)
    setOpen(true)

  }

  function onTicketPriceChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTicketPrice(Number(event.target.value))
  }

  function onHowManyTicketToPickChange(event: React.ChangeEvent<HTMLInputElement>) {
    setHowManyTicketToPick(Number(event.target.value))
  }

  async function onSubmit() {
    if (modalType === 'use') {
    
      const signatureFromMetaMask = await signMessage({
        message: `id: ${0}, ticket amount to use : ${howManyTicketToPick}`,
      })
      setSignature(signatureFromMetaMask)
      console.log("🚀 ~ file: MyTickets.page.tsx:43 ~ onSubmit ~ signature:", signatureFromMetaMask)
    }
  }


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

  let modalContent = <></>

  if (modalType === 'use') {
    if (signature === '') {
      modalContent = <>
                <input value={howManyTicketToPick} type="text" placeholder='How many' onChange={onHowManyTicketToPickChange} />
                <input value={ticketPrice} type="text" placeholder='Which price' onChange={onTicketPriceChange} />
                <button onClick={onSubmit}>Confirm</button>
            </>
    }
    else
    {
      modalContent = <>
        <h5>Scan this code to validate your ticket !</h5>
      </>
      const qr = new QRious({element: document.getElementById("qrcode"), value: 
      `${window.location.origin}/`});
      qr.size = 300
    }
  }
  if (modalType === 'sell') {
    modalContent = <>
            <input type="text" placeholder='How many' />
            <input type="text" placeholder='Which price' />
            <button onClick={onSubmit}>Confirm</button>
    </>
  }
  if (modalType === 'buy') {
    modalContent = <>
        <input type="text" placeholder='How many' />
        <input type="text" placeholder='Which price' />
        <button onClick={onSubmit}>Confirm</button>
      </>
  }

  return (
    <>
      <section id="my-tickets" className="page">
        
      <Modal open={open} setOpen={setOpen}>
          <div className="qrcode-wrapper">
            {modalContent }
            <canvas style={{display: signature ? 'block' : 'none'}}  id="qrcode"></canvas> 
          </div>

      </Modal>

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
                          <div className="event" key={eventTitle}>
                            <h3>{eventTitle}</h3>

                            <div className="tickets">
                              {
                                Object.values(categories).map((tickets) => <Ticket  owned={true} ticket={tickets[0]} key={tickets[0].id} amount={tickets.length} consumeTicket={consumeTicket} />)
                              }
                            </div>
                          </div>
                        )
                      })
                    }
                    {
                      Object.entries(myTicketsPerEvent).map(([eventTitle, categories]) => {
                        return (
                          <div className="event" key={eventTitle}>
                            <h3>{eventTitle}</h3>

                            <div className="tickets">
                              {
                                Object.values(categories).map((tickets) => <Ticket  owned={true} ticket={tickets[0]} key={tickets[0].id} amount={tickets.length} consumeTicket={consumeTicket} />)
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