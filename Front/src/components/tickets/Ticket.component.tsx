import './Ticket.scss'

type TProps = {
  ticket: TTicket,
  consumeTicket?: (ticket: TTicket, amount?: number) => void
  owned?: boolean
  amount?: number
}

export function Ticket({ ticket, consumeTicket, owned, amount }: TProps) {

  function handleBuy() {}
  function handleUse() {
    if (consumeTicket) consumeTicket(ticket, amount)
  }

  return (
    <>
      <div className={ 'ticket' }>
        <div className="left-deco deco"></div>

      
        {
          amount && <small className="amount">x{ amount }</small>
        }

        <div className="content-wrapper">
          <div className="data">
            <p className="description">{ ticket.description }</p>
          </div>
          <div className="price-wrapper">
            {
              
              owned
                ? <button className="price btn action" onClick={handleUse}>Use</button>
                : <button className="price btn action" onClick={handleBuy}>{ ticket.price }$</button>
            }
          </div>
        </div>


        <div className="right-deco deco"></div>
      </div>
    </>
  )
}