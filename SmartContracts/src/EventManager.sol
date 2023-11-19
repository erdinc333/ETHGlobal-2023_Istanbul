// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155//utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";


contract EventManager is ERC1155, IERC1155Receiver {
    using ECDSA for bytes32;
    
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
        string description;
    }

    struct TicketSelling
    {
        uint256 remainingQuantity;
        uint256 price;
    }


    event TicketBought(uint256 ticketId, uint256 quantity, address buyer, address seller);
    event UserTicketsUpdated(uint256 ticketId, uint256 quantity, address user);
    event EventCreated(uint256 eventId, string jsonCID, uint256 date, uint256[] ticketIds);
    event TicketCreated(uint256 ticketId, uint256 quantity);
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
        // Function to verify if a hashed message matches the provided message hash
    function verifyMsgHash(
        bytes32 messageHash,        // The expected message hash
        bytes memory userSignature  // The signature of the message
    ) public view returns (bool) {

        // Recover the signer's address from the signature and message hash
        address recoveredSigner = messageHash.recover(userSignature);

        // Compare the recovered address with the expected signer's address (e.g., msg.sender)
        return recoveredSigner == msg.sender;
    }

    function recoverAddressFromSignature(        
        bytes32 messageHash,        // The expected message hash
        bytes memory userSignature  // The signature of the message
        ) public pure returns (address) {
            // Recover the signer's address from the signature and message hash
            address recoveredSigner = messageHash.recover(userSignature);
            return recoveredSigner;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, IERC165) returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId || super.supportsInterface(interfaceId);
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

        uint256[] memory ticketIds = new uint256[](ticketsToSet.length);

        for(uint256 i = 0; i < ticketsToSet.length; i++)
        {
            uint256 ticketId = ticketsCount;
            ticketIds[i] = ticketId;

            ticketsOfEvents[eventId][currentEvent.ticketTypeCount] = ticketId;

            _mint(msg.sender, ticketId, ticketsToSet[i].quantity, "");
            emit TicketCreated(ticketId, ticketsToSet[i].quantity);
            emit UserTicketsUpdated(ticketId, ticketsToSet[i].quantity, msg.sender);

            currentEvent.ticketTypeCount++;
            ticketsCount++;
        }

        emit EventCreated(eventId, jsonCID, date, ticketIds);

        return eventId;
    }

    function useMultipleTicketsIds(uint256[] memory ticketsIds, uint256[] memory quantity) external
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

    function useTicket(uint256 ticketId, uint256 quantity, bytes32 messageHash, bytes memory userSignature) external
    {
        address recoveredSigner = recoverAddressFromSignature(messageHash, userSignature);

        require(balanceOf(recoveredSigner, ticketId) >= quantity, "You don't have enough tickets");

        _burn(recoveredSigner, ticketId, quantity);
        emit TicketUsed(ticketId, quantity, recoveredSigner);
        emit UserTicketsUpdated(ticketId, balanceOf(recoveredSigner, ticketId) - quantity, msg.sender);

    }

    function append(string memory a, string memory b, string memory c, string memory d, string memory e) internal pure returns (string memory) {

        return string(abi.encodePacked(a, b, c, d, e));

    }

    function buyTicket(uint256[] memory ticketsIds, uint256[] memory quantity, address from) external payable
    {
        for (uint256 i = 0; i < ticketsIds.length; i++)
        {
            uint256 ticketId = ticketsIds[i];
            TicketSelling storage currentTicketInSell = ticketsInSell[from][ticketId];

            require(currentTicketInSell.remainingQuantity >= quantity[i], "Seller doesn't have enough tickets");
            require(msg.value >= currentTicketInSell.remainingQuantity * currentTicketInSell.price,  append("Buyer doesn't have enough money, buyer money = ", Strings.toString(msg.value),  "ticket price = ", Strings.toString(currentTicketInSell.remainingQuantity * currentTicketInSell.price), ""));
            
            emit TicketBought(ticketId, quantity[i], msg.sender, from);
            emit UserTicketsUpdated(ticketId, balanceOf(msg.sender, ticketId) + quantity[i], msg.sender);
        }
        _safeBatchTransferFrom(address(this), msg.sender, ticketsIds, quantity, "");
    }

    function sellTicketInMarketplace(uint256[] memory ticketIds, uint256[] memory howMany, uint256[] memory sellPrices) external
    {
        for (uint256 i = 0; i < ticketIds.length; i++)
        {
            require(balanceOf(msg.sender, ticketIds[i]) >= howMany[i], "You don't have enough tickets");

            ticketsInSell[msg.sender][ticketIds[i]] = TicketSelling(howMany[i], sellPrices[i]);

            emit TicketInSell(ticketIds[i], howMany[i], sellPrices[i], msg.sender);
            emit UserTicketsUpdated(ticketIds[i], balanceOf(msg.sender, ticketIds[i]) - howMany[i], msg.sender);
        }
        setApprovalForAll(address(this), true);
        safeBatchTransferFrom(msg.sender, address(this), ticketIds, howMany, "");
    }

    function getEvent(uint256 eventId) external view returns (Event memory)
    {
        return events[eventId];
    }

    function getTicketInSell(address user, uint256 tickedId) external view returns (TicketSelling memory)
    {
        return ticketsInSell[user][tickedId];
    }

    function onERC1155Received(address, address, uint256, uint256, bytes memory) public virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) public virtual returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function onERC721Received(address, address, uint256, bytes memory) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }


}

