import * as React from "react"
import Select from 'react-select'
import 'react-select/dist/react-select.css';
const compact = require("lodash/compact")
const flatten = require("lodash/flatten")
const map = require("lodash/map")

export class ReactSelectAdapter extends React.Component {

    loadOptions = async (value)=> {
        let options = await this.props.loadOptions(value)
        return {options}
    }

    onSelect = (selectedItems)=> {
        selectedItems = compact(flatten([selectedItems]))
        this.props.onSelect(map(selectedItems, 'value'))
    }

    render(){
        let {selectedValues, multi} = this.props
        selectedValues = selectedValues.map((value)=> {
            return {value}
        })
        if(!multi){
            selectedValues = selectedValues[0]
        }
        return (
            <Select.Async 
                multi={multi}
                autoload={true}
                value={selectedValues}
                valueRenderer={(v) => v.value}                
                onChange={this.onSelect}
                loadOptions={this.loadOptions} />     
        )
    }
}