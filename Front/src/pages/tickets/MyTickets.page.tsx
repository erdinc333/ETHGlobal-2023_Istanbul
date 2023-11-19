/* eslint-disable @typescript-eslint/no-explicit-any */
import './MyTickets.scss'

import { useEffect, useState } from "react"
import { handleData } from '../../hooks/use-data/handleData.hook'
import { Ticket } from '../../components/tickets/Ticket.component'
import { Modal } from '../../components/global/modal/Modal.component'
import QRious from 'qrious';
import { signMessage } from '@wagmi/core'
import { writeContract, waitForTransaction } from '@wagmi/core'
import { contractAdresses } from '../../config/globalConfig'
import { eventContractABI } from '../../ABIs/EventContractABI'
import { parseEther } from 'viem'
import { useAccount } from 'wagmi'


type TEventTitle = string
type TTicketCategory = string

export function MyTickets() {
  const [myTicketsPerEvent, setMyTicketsPerEvent] = useState<Record<TEventTitle,  TTicket[]>>({})
  const [open, setOpen] = useState<boolean>(false)
  const [modalType, setModalType] = useState<TTicketModalType>('use')
  const [howManyTicketToPick, setHowManyTicketToPick] = useState<string>('')
  const [ticketPrice, setTicketPrice] = useState<string>('')
  const [signature, setSignature] = useState<string>('')
  const [selectedTicket, setSelectedTicket] = useState<TTicket>()
  const { address, isConnecting, isDisconnected } = useAccount()

  function consumeTicket(type: TTicketModalType , ticket: TTicket, amount?: number) {
    setModalType(type)
    setOpen(true)
    setSelectedTicket(ticket)
  }

  function onTicketPriceChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTicketPrice((event.target.value))
  }

  function onHowManyTicketToPickChange(event: React.ChangeEvent<HTMLInputElement>) {
    setHowManyTicketToPick((event.target.value))
  }

  async function onSubmit() {
    if (modalType === 'use') {
    
      const signatureFromMetaMask = await signMessage({
        message: `id: ${0}, ticket amount to use : ${howManyTicketToPick}`,
      })
      setSignature(signatureFromMetaMask)
      console.log("🚀 ~ file: MyTickets.page.tsx:43 ~ onSubmit ~ signature:", signatureFromMetaMask)
    }
    if (modalType === 'sell') {
      writeContract({
        address: contractAdresses.sepolia as any,
        abi: eventContractABI,
        functionName: 'sellTicketInMarketplace',
        args: [[selectedTicket?.id], [howManyTicketToPick], [parseEther(ticketPrice)]],
      })

    }
  }

  useEffect(() => {
    async function fetchData() {
      const tickets = await handleData().tickets.getMyTickets(address || '')
      const allUniqueEventIds = Array.from(new Set(tickets.map((ticket) => ticket.eventId)))

      const ticketsPerEvent: Record<TEventTitle, TTicket[]> = {}
      for (const eventId of allUniqueEventIds) {
        console.log("🚀 ~ file: MyTickets.page.tsx:71 ~ fetchData ~ eventId:", eventId)
        const event = await handleData().events.getEventById(eventId)
        const eventTickets = tickets.filter((_ticket) => _ticket.eventId === eventId)
        ticketsPerEvent[event?.title || 'Unknown Event'] = eventTickets
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
                <input value={howManyTicketToPick} type="number" placeholder='How many' onChange={onHowManyTicketToPickChange} />
                <button onClick={onSubmit}>Confirm</button>
            </>
    }
    else
    {
      
      const generatedUrl = `${window.location.origin}/dashboard/ticket?client-signature=${signature}&ticket-category-id=${0}&event-id=${0}&amount=${howManyTicketToPick}`
      const qr = new QRious({element: document.getElementById("qrcode"), value: 
      generatedUrl});
      qr.size = 300
      modalContent = <>
        <h5>Scan this code to validate your ticket !</h5>
        <a href={generatedUrl}>Url</a>
      </>
    }
  }
  if (modalType === 'sell') {
    modalContent = <>
            <input value={howManyTicketToPick} type="number" placeholder='How many' onChange={onHowManyTicketToPickChange} />
            <input value={ticketPrice} type="number" placeholder='Which price' onChange={onTicketPriceChange} />
            <button onClick={onSubmit}>Confirm</button>
    </>
  }
  if (modalType === 'buy') {
    modalContent = <>
        <input value={howManyTicketToPick} type="number" placeholder='How many' onChange={onHowManyTicketToPickChange} />
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
                      Object.entries(myTicketsPerEvent).map(([eventTitle, tickets]) => {
                        return (
                          <div className="event" key={eventTitle}>
                            <h3>{eventTitle}</h3>

                            <div className="tickets">
                              {
                                tickets.map((ticket) => <Ticket owned={true} ticket={ticket} key={ticket?.id} amount={ticket.supply} consumeTicket={consumeTicket} />)
                              }
                            </div>
                          </div>
                        )
                      })
                    }
                    {
                      Object.entries(myTicketsPerEvent).map(([eventTitle, tickets]) => {
                        return (
                          <div className="event" key={eventTitle}>
                            <h3>{eventTitle}</h3>

                            <div className="tickets">
                              {
                                tickets.map((ticket) => <Ticket  owned={true} ticket={ticket} key={ticket.id} amount={tickets.length} consumeTicket={consumeTicket} />)
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