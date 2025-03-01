import React, { useEffect, useState } from "react";
import "./index.css";

function Quote({ name, message, time }) { // Component for quotes
    return (
        <div className="quote bg-white p-4 rounded-lg shadow-lg mt-4 mb-4 hover:scale-105 transition-transform duration-200">
            <p className="font-bold">{name}</p>
            <p className="text-gray-700">{message}</p>
            <p className="text-sm text-gray-500"><em>{new Date(time).toLocaleString()}</em></p>
        </div>
    );
}

function App() {
	const [quotes, setQuotes] = useState([]);
	const [maxAge, setMaxAge] = useState("all");
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");

	useEffect(() => {
		async function fetchQuotes() {
			const response = await fetch(`/api/quotes?max_age=${maxAge}`);
			const data = await response.json();
			setQuotes(data.reverse());
		}
		fetchQuotes();
	}, [maxAge]);

	const handleSubmit = (event) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append("name", name);
		formData.append("message", message);
		
		fetch("/api/quote", {
			method: "POST",
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				setQuotes((prevQuotes) => [data, ...prevQuotes]);
				setName("");
				setMessage(""); 

				setNotification({message: "Successfully submitted quote!", type: "success"});
				setTimeout(() => setNotification({message: "", type: ""}), 3000);
			})
	};
	return (
		/* App */
		<div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 p-8 scroll-smooth">

			{/* Logo */}
			<div className="logo flex justify-center mb-5">
				<img src="/img/quotebook.png" alt="Logo" className="w-24 h-24"/>
			</div>

			{/* Header */}
			<h1>Hack at UCI Tech Deliverable</h1>

			{/* Form Submission */}
			<form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
					{/* Input Name */}
					<label htmlFor="input-name" className="block font-medium mb-1">Name</label>
					<input type="text" name="name" id="input-name" required value={name} onChange={(e) => setName(e.target.value)}
						className="w-full p-2 border rounded-md mb-4"
						placeholder="Buzz Lightyear"/>
					{/* Input Quote */}
					<label htmlFor="input-message" className="block font-medium mb-1">Quote</label>
					<input type="text" name="message" id="input-message" required value={message} onChange={(e) => setMessage(e.target.value)}
						className="w-full p-2 border rounded-md mb-4"
						placeholder="To Infinity and Beyond!"/>
					{/* Submit Button */}
					<button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors">Submit</button>
			</form>

			<h2>Previous Quotes</h2>
			{/* TODO: Display the actual quotes from the database */}
			<div className="messages">
				<p>Peter Anteater</p>
				<p>Zot Zot Zot!</p>
				<p>Every day</p>
			</div>
		</div>
	);
}

export default App;
