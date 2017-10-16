import {SearchkitComponent, Panel, renderComponent} from "searchkit"
import {RefinementSuggestAccessor} from "./RefinementSuggestAccessor"

import { ReactSelectAdapter} from "./adapters/react-select"


export class RefinementSuggest extends SearchkitComponent{

    static defaultProps = {
        containerComponent:Panel,
        autosuggestComponent: ReactSelectAdapter,
        multi:false
    }

    defineAccessor(){
        let { id, field, title, operator, size, orderKey, orderDirection, fieldOptions } = this.props
        return new RefinementSuggestAccessor(id, {
            id, field, title, operator, size, orderKey, orderDirection, fieldOptions
        })
    }

    search = async (query)=> {               
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