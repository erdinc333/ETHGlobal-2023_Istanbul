import { graphQueryUrl } from "../config/globalConfig"


export const fetchAllEvents = async () : Promise<TEventFromBlockchain[]> => {
    const answers = await fetchWithTheGraph(`
    {
        eventCreateds(first: 10, orderBy: blockTimestamp) {
          id
          eventId
          jsonCID
          date
          ticketIds
        }
      }
      `)
  
    return answers.eventCreateds
  }

  export const fetchOneEvent = async (eventId: number) : Promise<TEventFromBlockchain[]> => {
    const answers = await fetchWithTheGraph(`
    {
        eventCreateds(first: 10, orderBy: blockTimestamp, where: {eventId: ${eventId}}) {
          id
          eventId
          jsonCID
          date
          ticketIds
        }
      }
      `)
  
    return answers.eventCreateds
  }

  
  export const fetchMyTickets = async (myAddress: string) : Promise<TEventFromBlockchain[]> => {
    const answers = await fetchWithTheGraph(`
    {
      userTicketsUpdateds(where: {user: "${myAddress}"}) {
        quantity
        ticketId
        user
        eventIdOfTicket
        blockTimestamp
      }
    }
      `)
  
    return answers.userTicketsUpdateds
  }


  
const fetchWithTheGraph = async (query: string) => {
    const response = await fetch(graphQueryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
      }),
    })
    const data = await response.json()
    return data.data
  }
  