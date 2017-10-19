import React from "react"
import Autosuggest from 'react-autosuggest';
import './styles.css'
import { get } from 'lodash'

import {
    SearchBox
} from "searchkit"

const getSuggestions = (transport, query, field) => {
    const esQuery = {
        "suggest": {
            "query-suggest": {
                "prefix": query,
                "completion": {
                    "field": field
                }
            }
        }
    }
    // axios.get()
    return transport.search(esQuery)
        .then((response) => {
            return get(response, 'suggest.query-suggest[0].options', [])
        })
}

export class SearchBoxAutoComplete extends SearchBox {

    constructor(props) {
        super(props)
        this.state = {
            suggestions: []
        }
    }

    onChange(e, { newValue, method }) {
        super.onChange({ target: { value: newValue } })
    }

    getAutocompleteTransport() {
        return this.searchkit.transport
    }

    onSuggestionsFetchRequested = ({ value }) => {

        this.setState({ suggestions: [] })
        getSuggestions(this.getAutocompleteTransport(), value, this.props.autoCompleteField).then((suggestions) => {
            this.setState({
                suggestions: suggestions
            });
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {

        const { suggestions } = this.state

        const inputProps = {
            placeholder: this.props.placeholder || this.translate("searchbox.placeholder"),
            onFocus: this.setFocusState.bind(this, true),
            onBlur: this.setFocusState.bind(this, false),
            ref: "queryField",
            autoFocus: this.props.autofocus,
            onChange: this.onChange.bind(this),
            value: this.getValue()
        }

        return (
            <div className="search-autosuggest">
                <form onSubmit={this.onSubmit.bind(this)}>
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        inputProps={inputProps}
                        renderSuggestion={(suggestion) => <div>{suggestion.text}</div>}
                        getSuggestionValue={(suggestion) => suggestion.text}
                    />
                </form>
                {this.isLoading() && <div data-qa="loader" className="loader sk-loader"></div>}
            </div>
        );

    }
}