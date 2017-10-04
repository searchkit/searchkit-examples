import React from "react"
import {SearchkitManager} from "searchkit"
import SearchContainer from "./search-container.jsx"

export default class SearchApp extends React.Component {

  constructor(props) {      
    super(props)
    let isServer = typeof window === 'undefined'
    this.searchkit = new SearchkitManager(props.host, {
      useHistory: !isServer,
      searchOnLoad:false
    }, {
      results:props.results,
      state:props.state
    })
  }

  render(){
      return <SearchContainer searchkit={this.searchkit}/>
  }

}