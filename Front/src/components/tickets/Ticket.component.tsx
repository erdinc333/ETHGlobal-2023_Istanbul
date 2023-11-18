import { useState } from 'react'
import './Ticket.scss'

type TProps = {
  ticket: TTicket
}

export function Ticket({ ticket }: TProps) {
  const [extended, setExtended] = useState<boolean>(false)

  function handleClick() {
    setExtended((current) => !current)
  }

  return (
    <>
      <div className={ extended ? 'extended ticket' : 'ticket' } onClick={handleClick}>
        <div className="left-deco deco"></div>

        <div className="content-wrapper">
          <p className="description">{ ticket.description }</p>
          <div className="price-wrapper">
            <button className="price btn action">{ ticket.price }$</button>
          </div>
        </div>


        <div className="right-deco deco"></div>
      </div>
    </>
  )
}