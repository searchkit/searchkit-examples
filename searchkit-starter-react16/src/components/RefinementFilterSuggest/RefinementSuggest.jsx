import * as React from "react"
import {SearchkitComponent, Panel, renderComponent} from "searchkit"
import {RefinementSuggestAccessor} from "./RefinementSuggestAccessor"

import { ReactAutosuggestAdapter} from "./adapters/react-autosuggest"
import { ReactSelectAdapter} from "./adapters/react-select"

const map = require("lodash/map")
const flatten = require("lodash/flatten")
const compact = require("lodash/compact")

export class RefinementSuggest extends SearchkitComponent{

    constructor(props){
        super(props) 
    }

    static defaultProps = {
        containerComponent:Panel,
        autosuggestComponent: ReactSelectAdapter,
        multi:true
    }

    defineAccessor(){
        let {id, field, title, operator} = this.props
        return new RefinementSuggestAccessor(id, {
            id, field, title, operator
        })
    }

    search = async (query)=> {       
        if(!query){
            return []
        }
        
        let options = await this.accessor.search(query)    
        options = options.map((item)=> {
            return {
                value: item.key, 
                label: `${item.key} ${item.doc_count}`
            }
        })       
        return options
    }

    select = (values)=> {           
        this.accessor.state = this.accessor.state.setValue(values)
        this.searchkit.performSearch()
    }

    render(){    
        let { 
            containerComponent, autosuggestComponent, 
            id, title, multi
        } = this.props
        let selectedValues = this.accessor.state.getValue()
        let options = selectedValues.map((value) => {
            return { value, label: value }
        })      
        if(!this.props.multi){
            options = options[0]
        }


        return renderComponent(containerComponent, {
            title,
            className: id ? `filter--${id}` : undefined
        }, (
            renderComponent(autosuggestComponent, {
                multi,
                loadOptions:this.search,
                onSelect:this.select,
                selectedValues
            })         
        ))
    }
}