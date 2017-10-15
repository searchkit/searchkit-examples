import * as React from "react"
import {SearchkitComponent, Panel, renderComponent} from "searchkit"
import {RefinementSuggestAccessor} from "./RefinementSuggestAccessor"
import Select from 'react-select'
import 'react-select/dist/react-select.css';
const map = require("lodash/map")

export class RefinementSuggest extends SearchkitComponent{

    constructor(props){
        super(props) 
    }

    static defaultProps = {
        containerComponent:Panel
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
        return {options}
    }

    select = (val)=> {
        let values = map(val, "value")
        this.accessor.state = this.accessor.state.setValue(values)
        this.searchkit.performSearch()
    }

    render(){    
        let {containerComponent, id, title} = this.props
        let selectedValues = this.accessor.state.getValue()
        let options = selectedValues.map((value) => {
            return { value, label: value }
        })      
        return renderComponent(containerComponent, {
            title,
            className: id ? `filter--${id}` : undefined
        }, (
            <Select.Async 
                multi={true}
                autoload={true}
                value={options}
                valueRenderer={(v) => v.value}                
                onChange={this.select}
                loadOptions={this.search} />        
        ))
    }
}