from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import AsyncIterator

from fastapi import FastAPI, Form, status
from fastapi.responses import RedirectResponse
from typing_extensions import TypedDict

from services.database import JSONDatabase


class Quote(TypedDict):
    name: str
    message: str
    time: str


database: JSONDatabase[list[Quote]] = JSONDatabase("data/database.json")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Handle database management when running app."""
    if "quotes" not in database:
        print("Adding quotes entry to database")
        database["quotes"] = []

    yield

    database.close()


app = FastAPI(lifespan=lifespan)


@app.post("/quote")
def post_message(name: str = Form(), message: str = Form()) -> RedirectResponse:
    """
    Process a user submitting a new quote.
    You should not modify this function except for the return value.
    """
    now = datetime.now()
    quote = Quote(name=name, message=message, time=now.isoformat(timespec="seconds"))
    database["quotes"].append(quote)

    # You may modify the return value as needed to support other functionality
    return RedirectResponse("/", status.HTTP_303_SEE_OTHER)


# TODO: add another API route with a query parameter to retrieve quotes based on max age
@app.get("/quotes")
async def get_quotes(max_age: str = "all") -> list[dict]:
    """
    Retrieves quotes from the database based on provided max_age.
    max_age can be "all", "last year", "last month", or "last week".
    """
    now = datetime.now() # Gets the current time
    quotes = database["quotes"]

    match max_age: # Calculates the cutoff date we want to retrieve quotes from
        case "year":
            cutoff_date = now - timedelta(days=365)
        case "month":
            cutoff_date = now - timedelta(weeks=4)
        case "week":
            cutoff_date = now - timedelta(weeks=1)
        case _: 
            cutoff_date = None

    if cutoff_date: # Filters quotes based on the cutoff date
        filtered_quotes = [quote for quote in quotes if datetime.fromisoformat(quote["time"]) >= cutoff_date] 
        return filtered_quotes
    else:
        return quotes
