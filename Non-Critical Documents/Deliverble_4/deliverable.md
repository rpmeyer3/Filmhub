CSCI 4050/ 6050 Software Engineering
Term Project- Deliverable # 4
_____________________________________________________________________________________
Requirements:
Use a UML modeling tool, of your choice, to develop the domain class diagram for the
Cinema E-Booking system. Links for some free tools are available at the contents page on
eLC.
The class diagram should include all entity classes, dependencies, associations, and
multiplicities. Explicitly show composition and aggregation, if any.
For each class define the attributes and at least two functionalities identified based on use
case analysis. You may not be able to define the exact function signatures; we will specify
functionalities during Object Design Phase.
Your class diagram should, at least, model the following: -
1- Users are of two types admins and customers.
2- The system will store information about registered users (customers), including user ID, first name, last name, email and password. Optionally each user can store payment card
information.
3- A customer has one of three states: Active, inactive, or suspended.
4- System admins will be identified by their user id and password.
5- The system will allow the customer to store up to 3 payment cards. Card information
includes card number, billing address, and expiration date.
6- The system will store information about movies (see project document for details).
7- The cinema has one theatre and many showrooms. Each show room has different number
of seats.
8- The system should store booking information.
9- A customer may have many bookings. A single booking may have more than one ticket,
but all tickets are for the same show time.
10- Shows are scheduled in one of the showrooms. A show is identified by the show Id, data
and time, and duration.
11- A showroom can screen many movies at different times and a movie can be shown in any
showroom.
12- Admins can manage movies, promotions, ticket prices, and users.
13- Ticket prices are based on ticket type. Currently we have three types: adult tickets, senior
tickets, and child tickets. We may add more types in the future.
14- Customers can apply only one promotion to their order.
15- Your class diagram should include at least one enumeration.
Refer to the project document and the use case document. Use domain knowledge as well.

Add the cover page (see the sample cover page on eLC). Five points will be deducted for
missing the cover page.
We will not grade hand-drawn diagrams or diagrams drawn using Microsoft word or power
point.
Team leaders should submit the domain class diagram in pdf