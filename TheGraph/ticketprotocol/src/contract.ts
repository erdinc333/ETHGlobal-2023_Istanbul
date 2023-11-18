import {
  ApprovalForAll as ApprovalForAllEvent,
  EventCreated as EventCreatedEvent,
  TicketBought as TicketBoughtEvent,
  TicketCreated as TicketCreatedEvent,
  TicketInSell as TicketInSellEvent,
  TicketUsed as TicketUsedEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent
} from "../generated/Contract/Contract"
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
} from "../generated/schema"

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEventCreated(event: EventCreatedEvent): void {
  let entity = new EventCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.eventId = event.params.eventId
  entity.jsonCID = event.params.jsonCID
  entity.date = event.params.date
  entity.ticketIds = event.params.ticketIds

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTicketBought(event: TicketBoughtEvent): void {
  let entity = new TicketBought(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.ticketId = event.params.ticketId
  entity.quantity = event.params.quantity
  entity.buyer = event.params.buyer
  entity.seller = event.params.seller

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTicketCreated(event: TicketCreatedEvent): void {
  let entity = new TicketCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.ticketId = event.params.ticketId
  entity.quantity = event.params.quantity

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTicketInSell(event: TicketInSellEvent): void {
  let entity = new TicketInSell(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.ticketId = event.params.ticketId
  entity.quantity = event.params.quantity
  entity.price = event.params.price
  entity.seller = event.params.seller

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTicketUsed(event: TicketUsedEvent): void {
  let entity = new TicketUsed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.ticketId = event.params.ticketId
  entity.quantity = event.params.quantity
  entity.user = event.params.user

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  let entity = new TransferBatch(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.from = event.params.from
  entity.to = event.params.to
  entity.ids = event.params.ids
  entity.values = event.params.values

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  let entity = new TransferSingle(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.from = event.params.from
  entity.to = event.params.to
  entity.Contract_id = event.params.id
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleURI(event: URIEvent): void {
  let entity = new URI(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.value = event.params.value
  entity.Contract_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
