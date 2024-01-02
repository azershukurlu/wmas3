# Flashcard React App

This project is a React-based flashcard application with a JSON-Server backend.

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- npm: [Install npm](https://www.npmjs.com/get-npm)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/azershukurlu/wmas3.git
   ```

2. Navigate to the project directory:

- cd wmas3

3. Install dependencies for the React app:

- npm install
- npm install -g json-server
- npm install react-router-dom@latest

4. Start JSON-Server:

- npm run json-server

5. In a new terminal window, start the React app:

- npm start

### Usage

- In home page, you can see information about me and my projects; you are welcome to click on view project feature to view my projects.

- The flashcards are fetched from the JSON-Server, and you can use the application to create, edit, and delete flashcards.

- You can re-order the flashcards by dragging any desirable card and dropping it to any other card. Drag and drop feature can only be used when sorting is set for "Order". After re-ordering the cards through drag and drop, the page will render, and then you have to apply the sorting for order to retrieve the recently ordered data.

- You can sort the cards based on their IDs, question, answer, and modification date (this is default sort).

- You can search any card's question or answer through the search-box and find the desired card easily. However, as the cards are fetched 12 by 12 because of infinite scrolling, you have to scroll down so that you can have more access to other cards.

- You can filter the cards based on their status. The status options are: Full, Want to Learn, Noted, and Learned. By default, full, meaning that all cards are displayed.

- By clicking on the Create Card button, you can access the interface for adding new cards. After the click, you simply have to enter the question and answer details, then press the Save Card button.

- To change the status of the card, you simply have to flip the card and click on the change status button. First click will update the status to Noted; second click will update it to Learned.

- Utilizing the checkboxes on the corner of cards, you can select them and with the help of appeared share button, you can send the json format of those cards over the email.

- In contact me page, you can write about any desired topic to me.
