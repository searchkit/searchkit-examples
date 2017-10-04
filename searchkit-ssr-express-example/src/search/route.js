import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import SearchContainer from "./search-container.jsx"
import SearchApp from "./search-app.jsx"
import SearchHTMLTemplate from "./search-html-template.js"

import {SearchkitManager, EventEmitter} from "searchkit"

const searchRouter = express.Router()
const host = "http://demo.searchkit.co/api/movies"



searchRouter.get('/', (req, res)=> {
    let searchPath = req.originalUrl.split('?')[1] || ''
    let searchkit = new SearchkitManager(host, {
      useHistory: false,
      searchOnLoad:false
    })    
    ReactDOMServer.renderToString(<SearchContainer searchkit={searchkit}/>)
    searchkit.emitter.clear()
    searchkit.searchFromUrlQuery(searchPath)
        .then((searchkitState)=> {
            let appState = {...searchkitState, host}
            let content = ReactDOMServer.renderToString(<SearchApp {...appState}/>)
            res.send(SearchHTMLTemplate({ appState,content }))
        })

})

export default searchRouter