import * as React from "react"
import {mount} from "enzyme"
import {SearchkitAutosuggest} from "./SearchkitAutosuggest"
import {SearchkitManager} from "searchkit"
import { printPrettyHtml} from "searchkit/lib/src/components/__test__/TestHelpers.js"

describe("SearchkitAutosuggest", function(){

    
    it("Should render facets", ()=>{
        let searchkit = new SearchkitManager("http://demo.searchkit.co/api/movies")        
        this.wrapper = mount(
            <SearchkitAutosuggest searchkit={searchkit}/>            
        )
        this.wrapper.find("input").value="Spa"
        this.wrapper.find("input").simulate("change", {
            target:{value:"Spa"}
        })
        this.wrapper.update()
        printPrettyHtml(this.wrapper.html())
        // this.wrapper.find("input").simulate("change")
    })
})