import express from 'express';
import { appendFileSync } from 'node:fs'; // for adding the book details
import { readFileSync } from 'node:fs';  // for retrieving 

// needs:
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//check muna 
app.get('/', (req, res) => {
    res.send("Hello");
});

//given port
app.listen(3000, () => {
    console.log('Server started at port 3000');
});

// Validator function to check na string and non empty 
function validator(bookName, isbn, author, yearPublished) {
    return (
        typeof bookName === "string" && bookName.trim() !== "" &&
        typeof isbn === "string" && isbn.trim() !== "" &&
        typeof author === "string" && author.trim() !== "" &&
        typeof yearPublished === "string" && yearPublished.trim() !== "" && yearPublished > 0
    );
}

// POST route to add books
app.post('/add-book', (req, res) => {
    const { bookName, isbn, author, yearPublished } = req.body;

    // if wala or hindi navalidate return false
    if (!validator(bookName, isbn, author, yearPublished)) {
        return res.json({ success: false });
    }

    // content of bookInfo
    const bookInfo = `${bookName},${isbn},${author},${yearPublished}\n`;

    //using appendFileSync to add the details to books.txt
    try {
        appendFileSync('books.txt', bookInfo);
        res.json({ success: true });
    } catch (error) {
        console.log("Error", error); //checkeer
        res.json({ success: false });
    }
});

// Function to retrieve book details using ISBN and Author
function retrieveBookDetails(isbn, author) {
    try {
        const recordedData = readFileSync('books.txt', 'utf8'); //to read whats in the books file
        const lines = recordedData.split('\n');

        for (let line of lines) {
            const [bookName, bookISBN, bookAuthor, yearPub] = line.split(',').map(item => item.trim());

            if (bookISBN === isbn && bookAuthor === author) { // if it matches then return the details 
                return { success: true, bookName, isbn, author, yearPub };
            }
        }
        return { success: false, message: "Book not found" };
    } catch (error) {
        return { success: false, message: "There's an error" }; // to check
    }
}



// GET route to find book by ISBN and Author
app.get('/find-by-isbn-author', (req, res) => {
    const { isbn, author } = req.query;

    if (!isbn || !author) {
        return res.json({ success: false, message: "ISBN and Author required." });
    }

    const retrieveBook = retrieveBookDetails(isbn, author);
    res.json(retrieveBook);
});

// GET route to find books by Author onlyy
app.get('/find-by-author', (req, res) => {
    const { author } = req.query;

    if (!author) {
        return res.json({ success: false, message: "Author required." });
    }

    try {
        const recordedData = readFileSync('books.txt', 'utf8'); //read the file 
        const lines = recordedData.split('\n'); //split the details
        let booksByAuthor = []; //store

        for (let line of lines) { //extract infos
            const [bookName, bookISBN, bookAuthor, yearPub] = line.split(',').map(item => item.trim());

            if (bookAuthor === author) { //if author matches whats in the books file 
                booksByAuthor.push({ bookName, isbn: bookISBN, author, yearPub });
            }
        }

        if (booksByAuthor.length > 0) {
            return res.json({ success: true, books: booksByAuthor });
        } else {
            return res.json({ success: false, message: "No books found for this author" });
        }
    } catch (error) {
        return res.json({ success: false, message: "There's an error" });
    }
});
