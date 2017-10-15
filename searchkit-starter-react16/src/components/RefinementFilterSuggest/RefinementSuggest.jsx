import * as React from "react"
import {SearchkitComponent} from "searchkit"
import {RefinementSuggestAccessor} from "./RefinementSuggestAccessor"
import Autocomplete from "react-autocomplete"

export class RefinementSuggest extends SearchkitComponent{

    constructor(props){
        super(props)
        this.state = {
            value:""
        }
    }

    defineAccessor(){
        let {id, field} = this.props
        return new RefinementSuggestAccessor(id, {
            id, field
        })
    }

    render(){
        return (
            <Autocomplete
                getItemValue={(item) => item.label}
                items={[
                    { label: 'apple' },
                    { label: 'banana' },
                    { label: 'pear' }
                ]}
                renderItem={(item, isHighlighted) =>
                    <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                        {item.label}
                    </div>
                }
                value={this.state.value}
                onChange={(e) => {
                    this.setState({value:e.target.value})
                    this.accessor.search(e.target.value)
                }}
                onSelect={(value) => this.setState({ value})}
            />
        )
    }
}