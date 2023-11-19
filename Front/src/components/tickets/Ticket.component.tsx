import './Ticket.scss'
import { contractAdresses } from '../../config/globalConfig'
import { eventContractABI } from '../../ABIs/EventContractABI'
import { parseEther } from 'viem'
import { writeContract } from '@wagmi/core'

type TProps = {
  ticket: TTicket,
  consumeTicket?: (modalType: TTicketModalType, ticket: TTicket, amount?: number) => void
  owned?: boolean
  amount?: number
}

export function Ticket({ ticket, consumeTicket, owned, amount }: TProps) {

  function handleBuy() {
    writeContract({
      address: contractAdresses.sepolia as any,
      abi: eventContractABI,
      functionName: 'sellTicketInMarketplace',
      args: [[1], [0], [parseEther("0")]],
    })

    // if (consumeTicket) consumeTicket('buy', ticket, amount)
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