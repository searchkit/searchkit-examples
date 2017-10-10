import React from "react"
import SearchApp from "./search-app.jsx"
import ReactDOM from "react-dom"

ReactDOM.hydrate(
    <SearchApp {...window.__INITIAL_APP_STATE__}/>,
    document.getElementById("searchApp")
)

