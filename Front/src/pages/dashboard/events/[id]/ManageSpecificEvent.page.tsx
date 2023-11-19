/* eslint-disable @typescript-eslint/no-explicit-any */
import './ManageSpecificEvent.scss'

import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { handleData } from '../../../../hooks/use-data/handleData.hook'
import { Modal } from '../../../../components/global/modal/Modal.component'
import { IpfsClientContext } from '../../../../Contexts/ipfsClientContext'
import { uploadFile } from '../../../../lib/IPFS/ipfs_client'
import { useAccount, useContractWrite } from 'wagmi'
import { eventContractABI } from '../../../../ABIs/EventContractABI'
import { writeContract, waitForTransaction } from '@wagmi/core'
import { contractAdresses } from '../../../../config/globalConfig'


export function ManageSpecificEvent() {
  const { id: eventId } = useParams() 
  const [event, setEvent] = useState<TEvent | null>(null)
  const [ticketCategories, setTicketCategories] = useState<TTicketCategory[]>([])
  const [tmpBegin, setTmpBegin] = useState<string>('')
  const [tmpEnd, setTmpEnd] = useState<string>('')
  const [openCreateTickets, setOpenCreateTickets] = useState<boolean>(false)
  const [newTickets, setNewTicket] = useState<TTicketCategory>({ label: '', supply: 1, transferFees: 0 })
  const ipfsClient = useContext(IpfsClientContext)
  const { address, isConnecting, isDisconnected } = useAccount()

  function dateToDatetimeString(date: Date | null | undefined): string {
    if (!date) return ''
    return (new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString()).slice(0, -1)
  }

  function handleBeginUpdate(event: React.ChangeEvent<HTMLInputElement>) {
    setEvent((curr) => {
      const newDate = new Date(Date.parse(event.target.value))
      setTmpBegin(dateToDatetimeString(newDate))
      return (curr ? { ...curr, dateTimeRange: { begin: newDate, end: curr.dateTimeRange.end } } : null)
    })
  }
  function handleEndUpdate(event: React.ChangeEvent<HTMLInputElement>) {
    setEvent((curr) => {
      const newDate = new Date(Date.parse(event.target.value))
      setTmpEnd(dateToDatetimeString(newDate))
      return (curr ? { ...curr, dateTimeRange: { end: newDate, begin: curr.dateTimeRange.begin } } : null)
    })
  }

  function onTicketAdd()
  {
    if (!event) return
    const newTicketCategories = [...ticketCategories, newTickets]
    setTicketCategories(newTicketCategories)
    setNewTicket({ label: '', supply: 1, transferFees: 0 })
    setOpenCreateTickets(false)
  }

  function buildPayload(event: TEvent): TCreateEventPayload
  {
    return {
      title: event.title,
      description: event.description,
      location: event.location,
      dateTimeRange: event.dateTimeRange,
      picturesURL: event.picturesURL,
      tickets: ticketCategories,
      authorAddress: event.authorAddress,
      status: event.status,
    }
  }

  function convertTicketCategoriesToPayload(ticketCategories: TTicketCategory[]): TTicketCreationPayload[]
  {
    return ticketCategories.map((ticketCategory) => ({
      quantity: ticketCategory.supply,
      description: ticketCategory.label,
    }))
  }

  

  async function createEvent() {
    console.log("updateEvent button clicked")

    if (!event) return
    if (!ipfsClient) return
    console.log("updateEvent launched ...")
    const cid = await uploadFile(ipfsClient, buildPayload(event));
    console.log("contract address", contractAdresses.sepolia)
    writeContract({
      address: contractAdresses.sepolia as any,
      abi: eventContractABI,
      functionName: 'createEvent',
      args: [cid, 0, 0, convertTicketCategoriesToPayload(ticketCategories)],
    })

  }

  useEffect(() => {
    async function fetchData() {
      const wantedEvent = await handleData().events.getEventById(eventId || '')
      setEvent(wantedEvent)

      setTmpBegin(dateToDatetimeString(wantedEvent?.dateTimeRange.begin))
      setTmpEnd(dateToDatetimeString(wantedEvent?.dateTimeRange.end))

      const ticketCategories = await handleData().tickets.getEventTicketCategories(eventId || '')
      setTicketCategories(ticketCategories)
    }

    fetchData()

  }, [eventId])

  return (
    <>
      <section id="manage-specific-event" className="page">
        <Modal open={openCreateTickets} setOpen={setOpenCreateTickets}>
          <div className="ticket-form">
            <input type="text" placeholder="Description" value={newTickets.label} onChange={ (e) => setNewTicket((curr) => ({ ...curr, label: e.target.value })) } />
            <input type="number" placeholder="Supply" min="1" value={newTickets.supply || ""} onChange={ (e) => setNewTicket((curr) => ({ ...curr, supply: Number(e.target.value) })) } />
            <button className="btn action" onClick={onTicketAdd} >Add Ticket</button>
          </div>
        </Modal>
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
                  <button className="btn action" onClick={createEvent}>Update Event</button>
                </section>

                <section className="market-place">
                  <h2>Tickets supply</h2>
                  <div className="tickets">
                    {
                      ticketCategories.map((category) => (
                          <div className="category" key={category.label}>
                            <p className="label">{category.label}</p>
                            <p className="supply">x{category.supply}</p>
                          </div>
                        )
                      )
                    }
                  </div>

                  <button className="btn action" onClick={() => setOpenCreateTickets(true)}>Create Tickets</button>
                </section>
              </>
            : <p className="not-found">Event not found</p>
        }
        
      </section>
    </>
  )
}