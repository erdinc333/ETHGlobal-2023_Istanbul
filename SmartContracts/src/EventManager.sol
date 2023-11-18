// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

struct Event
{
    uint256 id;
    string jsonCID;
    uint256 date;
    address payable owner;
    uint256 ticketTypeCount;
    uint256 ticketStorageId;
}

struct Ticket
{
    uint256 price;
    uint256 quantity;
    uint256 sold;
    uint256 resellFees;
    address payable owner;
}


interface IEventManager is ERC1155
{
    function createEvent(string jsonCID, uint256 date, Ticket[] tickets) external returns (uint256);
    function createTicket(uint256 eventId, uint256 price, uint256 quantity) external returns (uint256);

    function editEvent(uint256 eventId, string jsonCID, uint256 date) external;


    function buyTicket(uint256 ticketId) external payable;
    function transferTickets(uint256 ticketId, uint256 quantity, address to) external;
    function useTickets(uint256 ticketId, uint256 quantity) external;
    function allowSellingForTicket(uint256[] ticketIds, uint256[] howMany) external;
    function getTicket(uint256 ticketId) external view returns (uint256, uint256, uint256, uint256, uint256, address);
    function getEvent(uint256 eventId) external view returns (uint256, string memory, string memory, uint256, address);

}

contract EventManager is IEventManager {
    event TicketBought(uint256 ticketId, uint256 quantity, address buyer);



    uint256 public eventCount;
    mapping(uint256 => Event) public events;

    uint256 public ticketStorageCount;
    mapping(uint256 => uint256) public ticketsIdsOfTicketStorage;
    mapping(uint256 => mapping(uint256 => Ticket)) public ticketsStorage;
    mapping(string => uint256) public cidToEventId;

    uint256 ticketCount;

    constructor() ERC1155("https://{cid}.ipfs.w3s.link/")
    {
    
    }

    function createEvent(string jsonCID, uint256 date, Ticket[] tickets) external returns (uint256)
    {
        uint256 eventId = eventCount;
        events[eventId] = Event(eventId, jsonCID, date, payable(msg.sender), ticketStorageCount);
        eventCount++;

        uint256 ticketStorageId = ticketStorageCount;
        for(uint256 i = 0; i < tickets.length; i++)
        {
            _mint(msg.sender, ticketCount, tickets[i].quantity, "");
            ticketsStorage[ticketStorageId][i] = tickets[i];
        }
        ticketsCountPerStorage[ticketStorageId] = tickets.length;
        ticketStorageCount++;

        return eventId;
    }




}
