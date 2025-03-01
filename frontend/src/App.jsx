import React, { useEffect, useState, useRef } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import Typed from "typed.js";
import "./index.css";

function Quote({ name, message, time }) { // Component for quotes
    return (
        <div className="quote bg-white p-4 rounded-lg shadow-xl mt-4 mb-4 hover:scale-105 transition-transform duration-200">
            <p className="font-bold">{name}</p>
            <p className="text-gray-700">{message}</p>
            <p className="text-sm text-gray-500"> 
			<em>{new Date(time).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} 
    			{", "} 
    			{new Date(time).toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}
			</em></p>
        </div>
    );
}

function App() {
	const [quotes, setQuotes] = useState([]);
	const [maxAge, setMaxAge] = useState("all");
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");
	const typedRef = useRef(null); // stores DOM element referencing the element

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
	
	useEffect(() => {
		const typed = new Typed(typedRef.current, {
			strings: ["Hack @ UCI Tech Deliverable!"],
			typeSpeed: 60,
			startDelay: 300,
			showCursor: true,

		});
		return () => {
            typed.destroy();
        };
	}, []);

	const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const scrollToBottom = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    };

	return (
		/* App */
		<div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 p-5 scroll-smooth font-mono">

			{/* Logo */}
			<div className="logo flex justify-start mb-5">
				<img src="/img/quotebook.png" alt="Logo" className="w-24 h-24 hover:animate-spin"/>
			</div>

			{/* Header */}
			<h1 className="text-4xl font-bold text-center mb-8">
				<span ref={typedRef}/>
			</h1>

			{/* Form Submission */}
			<form onSubmit={handleSubmit} className="bg-white px-6 py-5 rounded-lg shadow-xl w-1/3 mx-auto">
				<div className="flex flex-col">
					{/* Input Name */}
					<label htmlFor="input-name" className="block font-medium mb-1">Name</label>
					<input type="text" name="name" id="input-name" required value={name} onChange={(e) => setName(e.target.value)}
						className="w-full p-2 border rounded-md mb-4"
						placeholder="Martin Luther King Jr."/>
					{/* Input Quote */}
					<label htmlFor="input-message" className="block font-medium mb-1">Quote</label>
					<input type="text" name="message" id="input-message" required value={message} onChange={(e) => setMessage(e.target.value)}
						className="w-full p-2 border rounded-md mb-4"
						placeholder="I have a dream!"/>
					{/* Submit Button */}
					<button type="submit" className="w-1/3 bg-green-400 text-white p-2 rounded-lg hover:bg-green-500 transition-colors mt-2 mx-auto">Submit</button>
				</div>
			</form>

			{/* Quote Filter */}
			<div className="w-1/3 mx-auto pt-10">
				<div className="bg-white p-2 rounded-lg shadow-md flex justify-center gap-5 mx-auto">
				{['all', 'year', 'month', 'week'].map((value) => (
					<button
					key={value}
					onClick={() => setMaxAge(value)}
					className={`px-4 py-2 rounded-md focus:outline-none ${
						maxAge === value
						? 'bg-green-400 text-white'
						: 'text-gray-700 hover:bg-green-100'
					}`}
					disabled={maxAge === value} 
					>
					{value === 'all' ? 'All' : `Last ${value.charAt(0).toUpperCase() + value.slice(1)}`}
					</button>
				))}
				</div>
			</div>


			{/* Previous Quotes */}
			<div className="w-1/3 mx-auto">
				<div className ="flex">
					<h2 className="text-2xl font-semibold mt-8 mb-4 text-center w-full">Previous Quotes</h2>
					{/* Smooth Scroll Button */}
					<div className="inline-block w-1/12 text-right">
						<button
							onClick={scrollToBottom}
							className="absolute bg-white text-black p-3 rounded-lg transition-colors hover:animate-bounce mt-24"
						>
							<FaArrowDown />
						</button>
					</div>
				</div>
				{/* Quotes */}
				<div className="messages-wrapper relative max-w-lg mx-auto">
					<div className="messages">
						{quotes.map((quote, index) => (
							<div key={index} className="relative">
								<Quote
									name={quote.name}
									message={quote.message}
									time={quote.time}
								/>
								{index === quotes.length - 1 && (
									<button
										onClick={scrollToTop}
										className="absolute top-1/2 right-[-60px] bg-white text-black p-3 rounded-lg transition-colors hover:animate-bounce"
									>
										<FaArrowUp />
									</button>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
