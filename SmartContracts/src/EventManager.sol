// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

struct Event
{
    string jsonCID;
    uint256 date;
    uint256 resellFees;
    address payable owner;
    uint256 ticketTypeCount;
}

struct Ticket
{
    uint256 quantity;
}

struct TicketSelling
{
    uint256 remainingQuantity;
    uint256 price;
}

contract EventManager is ERC1155 {
    event TicketBought(uint256 ticketId, uint256 quantity, address buyer, address seller);
    event EventCreated(uint256 eventId, string jsonCID, uint256 date, uint256[] ticketIds);
    event TicketUsed(uint256 ticketId, uint256 quantity, address user);
    event TicketInSell(uint256 ticketId, uint256 quantity, uint256 price, address seller);

    uint256 public eventCount;
    mapping(uint256 => Event) public events;

    uint256 public ticketsCount;
    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => mapping(uint256 => uint256)) public ticketsOfEvents;     // mapping(eventId => mapping(ticketTypeInEventCount => ticketId))
    mapping(string => uint256) public cidToEventId;
    mapping(address => mapping(uint256 => TicketSelling)) public ticketsInSell; // mapping(seller => mapping(ticketId => TicketSelling))


    constructor() ERC1155("https://{cid}.ipfs.w3s.link/")
    {
    
    }

    function createEvent(string memory jsonCID, uint256 date, uint256 resellFees, Ticket[] memory ticketsToSet) external returns (uint256)
    {
        uint256 eventId = eventCount;
        Event storage currentEvent = events[eventId];
        currentEvent.jsonCID = jsonCID;
        currentEvent.date = date;
        currentEvent.resellFees = resellFees;
        currentEvent.owner = payable(msg.sender);
        currentEvent.ticketTypeCount = 0;

        eventCount++;

        for(uint256 i = 0; i < ticketsToSet.length; i++)
        {
            uint256 ticketId = ticketsCount;

            currentTicket.quantity = ticketsToSet[i].quantity;

            ticketsOfEvents[eventId][currentEvent.ticketTypeCount] = ticketId;

            _mint(msg.sender, ticketId, ticketsToSet[i].quantity, "");

            currentEvent.ticketTypeCount++;
            ticketsCount++;
        }

        return eventId;
    }

    function useTickets(uint256[] memory ticketsIds, uint256[] memory quantity) external
    {
        for (uint256 i = 0; i < ticketsIds.length; i++)
        {
            uint256 ticketId = ticketsIds[i];
            uint256 ticketQuantity = quantity[i];

            require(balanceOf(msg.sender, ticketId) > ticketQuantity, "You don't have enough tickets");


            _burn(msg.sender, ticketId, ticketQuantity);
            emit TicketUsed(ticketId, ticketQuantity, msg.sender);
        }
    }

    function buyTicket(uint256[] memory ticketsIds, uint256[] memory quantity, address from) external payable
    {
        for (uint256 i = 0; i < ticketsIds.length; i++)
        {
            uint256 ticketId = ticketsIds[i];
            TicketSelling storage currentTicketInSell = ticketsInSell[from][ticketId];

            require(currentTicketInSell.remainingQuantity > quantity[i], "Seller doesn't have enough tickets");
            require(msg.value > currentTicketInSell.remainingQuantity * currentTicketInSell.price, "Seller doesn't have enough tickets");
        }
    }

    function sellTicketInMarketplace(uint256[] memory ticketIds, uint256[] memory howMany, uint256[] memory sellPrices) external
    {
        for (uint256 i = 0; i < ticketIds.length; i++)
        {
            require(balanceOf(msg.sender, ticketIds[i]) >= howMany[i], "You don't have enough tickets");

            ticketsInSell[msg.sender][ticketIds[i]] = TicketSelling(howMany[i], sellPrices[i]);

            emit TicketInSell(ticketIds[i], howMany[i], sellPrices[i], msg.sender);
        }
        setApprovalForAll(address(this), true);
        safeBatchTransferFrom(msg.sender, address(this), ticketIds, howMany, "");
    }





}
