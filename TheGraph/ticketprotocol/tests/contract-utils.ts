import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ApprovalForAll,
  EventCreated,
  TicketBought,
  TicketCreated,
  TicketInSell,
  TicketUsed,
  TransferBatch,
  TransferSingle,
  URI
} from "../generated/Contract/Contract"

export function createApprovalForAllEvent(
  account: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createEventCreatedEvent(
  eventId: BigInt,
  jsonCID: string,
  date: BigInt,
  ticketIds: Array<BigInt>
): EventCreated {
  let eventCreatedEvent = changetype<EventCreated>(newMockEvent())

  eventCreatedEvent.parameters = new Array()

  eventCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "eventId",
      ethereum.Value.fromUnsignedBigInt(eventId)
    )
  )
  eventCreatedEvent.parameters.push(
    new ethereum.EventParam("jsonCID", ethereum.Value.fromString(jsonCID))
  )
  eventCreatedEvent.parameters.push(
    new ethereum.EventParam("date", ethereum.Value.fromUnsignedBigInt(date))
  )
  eventCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "ticketIds",
      ethereum.Value.fromUnsignedBigIntArray(ticketIds)
    )
  )

  return eventCreatedEvent
}

export function createTicketBoughtEvent(
  ticketId: BigInt,
  quantity: BigInt,
  buyer: Address,
  seller: Address
): TicketBought {
  let ticketBoughtEvent = changetype<TicketBought>(newMockEvent())

  ticketBoughtEvent.parameters = new Array()

  ticketBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "ticketId",
      ethereum.Value.fromUnsignedBigInt(ticketId)
    )
  )
  ticketBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "quantity",
      ethereum.Value.fromUnsignedBigInt(quantity)
    )
  )
  ticketBoughtEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  ticketBoughtEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )

  return ticketBoughtEvent
}

export function createTicketCreatedEvent(
  ticketId: BigInt,
  quantity: BigInt
): TicketCreated {
  let ticketCreatedEvent = changetype<TicketCreated>(newMockEvent())

  ticketCreatedEvent.parameters = new Array()

  ticketCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "ticketId",
      ethereum.Value.fromUnsignedBigInt(ticketId)
    )
  )
  ticketCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "quantity",
      ethereum.Value.fromUnsignedBigInt(quantity)
    )
  )

  return ticketCreatedEvent
}

export function createTicketInSellEvent(
  ticketId: BigInt,
  quantity: BigInt,
  price: BigInt,
  seller: Address
): TicketInSell {
  let ticketInSellEvent = changetype<TicketInSell>(newMockEvent())

  ticketInSellEvent.parameters = new Array()

  ticketInSellEvent.parameters.push(
    new ethereum.EventParam(
      "ticketId",
      ethereum.Value.fromUnsignedBigInt(ticketId)
    )
  )
  ticketInSellEvent.parameters.push(
    new ethereum.EventParam(
      "quantity",
      ethereum.Value.fromUnsignedBigInt(quantity)
    )
  )
  ticketInSellEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  ticketInSellEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )

  return ticketInSellEvent
}

export function createTicketUsedEvent(
  ticketId: BigInt,
  quantity: BigInt,
  user: Address
): TicketUsed {
  let ticketUsedEvent = changetype<TicketUsed>(newMockEvent())

  ticketUsedEvent.parameters = new Array()

  ticketUsedEvent.parameters.push(
    new ethereum.EventParam(
      "ticketId",
      ethereum.Value.fromUnsignedBigInt(ticketId)
    )
  )
  ticketUsedEvent.parameters.push(
    new ethereum.EventParam(
      "quantity",
      ethereum.Value.fromUnsignedBigInt(quantity)
    )
  )
  ticketUsedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )

  return ticketUsedEvent
}

export function createTransferBatchEvent(
  operator: Address,
  from: Address,
  to: Address,
  ids: Array<BigInt>,
  values: Array<BigInt>
): TransferBatch {
  let transferBatchEvent = changetype<TransferBatch>(newMockEvent())

  transferBatchEvent.parameters = new Array()

  transferBatchEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam("ids", ethereum.Value.fromUnsignedBigIntArray(ids))
  )
  transferBatchEvent.parameters.push(
    new ethereum.EventParam(
      "values",
      ethereum.Value.fromUnsignedBigIntArray(values)
    )
  )

  return transferBatchEvent
}

export function createTransferSingleEvent(
  operator: Address,
  from: Address,
  to: Address,
  id: BigInt,
  value: BigInt
): TransferSingle {
  let transferSingleEvent = changetype<TransferSingle>(newMockEvent())

  transferSingleEvent.parameters = new Array()

  transferSingleEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  transferSingleEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return transferSingleEvent
}

export function createURIEvent(value: string, id: BigInt): URI {
  let uriEvent = changetype<URI>(newMockEvent())

  uriEvent.parameters = new Array()

  uriEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromString(value))
  )
  uriEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return uriEvent
}
