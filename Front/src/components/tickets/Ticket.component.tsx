import './Ticket.scss'

type TProps = {
  ticket: TTicket,
  consumeTicket?: (modalType: TTicketModalType, ticket: TTicket, amount?: number) => void
  owned?: boolean
  amount?: number
}

export function Ticket({ ticket, consumeTicket, owned, amount }: TProps) {

  function handleBuy() {
    if (consumeTicket) consumeTicket('buy', ticket, amount)
  }
  function handleSell() {
    if (consumeTicket) consumeTicket('sell', ticket, amount)
  }
  function handleUse() {
    if (consumeTicket) consumeTicket('use', ticket, amount)
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
                ? <>
                    <button className="price btn action" onClick={handleUse}>Use</button>
                    <button className="price btn action" onClick={handleSell}>Sell</button>
                </> 
                : <button className="price btn action" onClick={handleBuy}>{ ticket.price }$</button>
            }
          </div>
        </div>


        <div className="right-deco deco"></div>
      </div>
    </>
  )
}