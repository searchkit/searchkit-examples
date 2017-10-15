import * as React from "react"
import Autosuggest from "react-autosuggest"
import "./styles.css"
const uniq = require("lodash/uniq")

const renderSuggestion = suggestion =>
    <div>
        {suggestion.label}
    </div>;

export class ReactAutosuggestAdapter extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            value: '',
            suggestions: []
        }

    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = async ({ value }) => {
        let suggestions = await this.props.loadOptions(value)
        this.setState({
            suggestions
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    onSuggestionSelected = (e, options) => {       
        let values = [options.suggestionValue]
        if(this.props.multi) {
            values = uniq(this.props.selectedValues.concat(options.suggestionValue))
        }
        this.props.onSelect(values)
        this.setState({value:''})
    }

    render() {
        const { value } = this.state
        const inputProps = {
            value,
            onChange: this.onChange
        };
        return (
            <div className="search-autosuggest">
                <Autosuggest
                    suggestions={this.state.suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    onSuggestionSelected={this.onSuggestionSelected}
                    getSuggestionValue={(item) => item.value}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    id="basic-example"
                />
            </div>
        )
    }
}