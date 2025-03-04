import needle from 'needle';

// book details to input 
const bookData = {
    bookName: "Harry Potter and the Philosopher’s Stone",
    isbn: "978-0-7475-3269-9",
    author: "J.K Rowling",
    yearPublished: "1997"
};


needle.post(
    'http://localhost:3000/add-book',
    bookData,
    { json: true },
    (err, res) => {
        if (err) {
            console.error("Request Error:", err);
        }  else {
            console.log("Response:", res.body);
        }
    }
);

needle.get(
    'http://localhost:3000/find-by-isbn-author?isbn=978-0-7475-3269-9&author=J.K%20Rowling',
    (err, res) => {
        if (err) {
            console.error("Request Error:", err);
        } else {
            console.log("Response:", res.body);
        }
    }
);

needle.get(
    'http://localhost:3000/find-by-author?author=J.K+Rowling',
    (err, res) => {
        if (err) {
            console.error("Request Error:", err);
        } else {
            console.log("Response:", res.body);
        }
    }
);
