// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "ds-test/test.sol";
import "forge-std/Test.sol";
import "../src/EventManager.sol";

contract EventManagerTest is Test {
    EventManager eventManager;

    address user = 0x4b5eabCe8F6c9A28f90A6b7FcdbC49E4F4F0b8c5;
    address buyer = 0xc57f48B1c3827eDBc7F9e1603D2CDeE52b249a02;

    function setUp() public {
        eventManager = new EventManager();

        // add 10 ether to fake user account
        // vm.deal(user, 10 ether);
    }

    function testCreateEvent() public {
        EventManager.Ticket[] memory ticketsToSet = new EventManager.Ticket[](1);
        ticketsToSet[0] = EventManager.Ticket(100, "General", "General Admission");

        vm.prank(user); // only the next line will be called by "user" address
        uint256 eventId = eventManager.createEvent("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco", block.timestamp, 10, ticketsToSet);

        assertEq(eventId, 0, "Event ID should be 0 for the first event");
    }

    function testEventProperties() public {
        EventManager.Ticket[] memory ticketsToSet = new EventManager.Ticket[](1);
        ticketsToSet[0] = EventManager.Ticket(100, "General", "General Admission");

        vm.prank(user); // only the next line will be called by "user" address
        uint256 eventId = eventManager.createEvent("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco", block.timestamp, 10, ticketsToSet);

        EventManager.Event memory EventCreated = eventManager.getEvent(eventId);

        assertEq(keccak256(abi.encodePacked(EventCreated.jsonCID)), keccak256(abi.encodePacked("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco")), "Event jsonCID does not match");
        assertEq(EventCreated.date, block.timestamp, "Event date does not match");
        assertEq(EventCreated.resellFees, 10, "Event resellFees does not match");
        assertEq(EventCreated.owner, user, "Event owner does not match");
        assertEq(EventCreated.ticketTypeCount, 1, "Event ticketTypeCount does not match");
    }

    function testSellTicketInMarketplace() public {
        EventManager.Ticket[] memory ticketsToSet = new EventManager.Ticket[](1);
        ticketsToSet[0] = EventManager.Ticket(100, "General", "General Admission");

        vm.prank(user); // only the next line will be called by "user" address
        uint256 eventId = eventManager.createEvent("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco", block.timestamp, 10, ticketsToSet);

        uint256[] memory ticketIds = new uint256[](1);
        ticketIds[0] = 0; // assuming the ticketId is 0
        uint256[] memory howMany = new uint256[](1);
        howMany[0] = 1; // sell 1 ticket
        uint256[] memory sellPrices = new uint256[](1);
        sellPrices[0] = 1 ether; // sell price is 1 ether

        vm.prank(user); // only the next line will be called by "user" address
        eventManager.sellTicketInMarketplace(ticketIds, howMany, sellPrices);

        // check if the ticket is on sale
        EventManager.TicketSelling memory ticketOnSale = eventManager.getTicketInSell(user, ticketIds[0]);
        assertEq(ticketOnSale.remainingQuantity, howMany[0], "Ticket quantity on sale should match");
        assertEq(ticketOnSale.price, sellPrices[0], "Ticket price on sale should match");
    }

    // function testBuyTicket() public {
    //     EventManager.Ticket[] memory ticketsToSet = new EventManager.Ticket[](1);
    //     ticketsToSet[0] = EventManager.Ticket(100, "General", "General Admission");

    //     vm.prank(user); // only the next line will be called by "user" address
    //     uint256 eventId = eventManager.createEvent("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco", block.timestamp, 10, ticketsToSet);

    //     uint256[] memory ticketIds = new uint256[](1);
    //     ticketIds[0] = 0; // assuming the ticketId is 0
    //     uint256[] memory quantity = new uint256[](1);
    //     quantity[0] = 1; // buy 1 ticket

    //     vm.prank(user); // only the next line will be called by "user" address
    //     eventManager.buyTicket(ticketIds, quantity, user); // assuming the tickets are sold by "user"

    //     // check if the ticket is bought
    //     assertEq(eventManager.balanceOf(user, ticketIds[0]), 99, "Ticket quantity should decrease by 1 after buying");
    // }

    function testBuyTicket() public {
        EventManager.Ticket[] memory ticketsToSet = new EventManager.Ticket[](1);
        ticketsToSet[0] = EventManager.Ticket(100, "General", "General Admission");

        vm.prank(user); // only the next line will be called by "user" address
        uint256 eventId = eventManager.createEvent("QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco", block.timestamp, 10, ticketsToSet);

        uint256[] memory ticketIds = new uint256[](1);
        ticketIds[0] = 0; // assuming the ticketId is 0
        uint256[] memory howMany = new uint256[](1);
        howMany[0] = 1; // sell 1 ticket
        uint256[] memory sellPrices = new uint256[](1);
        sellPrices[0] = 1 ether; // sell price is 1 ether

        vm.prank(user); // only the next line will be called by "user" address
        eventManager.sellTicketInMarketplace(ticketIds, howMany, sellPrices);

        uint256[] memory quantity = new uint256[](1);
        quantity[0] = 1; // buy 1 ticket

        vm.deal(buyer, 2 ether);
        vm.prank(buyer); // only the next line will be called by "buyer" address
        eventManager.buyTicket(ticketIds, quantity, user); // assuming the tickets are bought by "buyer"

        // check if the ticket is bought
        assertEq(eventManager.balanceOf(buyer, ticketIds[0]), 1, "Ticket quantity should increase by 1 after buying");
        assertEq(eventManager.balanceOf(user, ticketIds[0]), 99, "Ticket quantity should decrease by 1 after selling");
    }
}