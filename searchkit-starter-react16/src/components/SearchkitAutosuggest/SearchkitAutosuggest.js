import {SearchkitComponent} from "searchkit"
import * as React from "react"
import Autosuggest from "react-autosuggest"
import {DatasourceManager} from "./DatasourceManager"
import "./styles.css"

const each = require("lodash/each")
const prop = require("lodash/property")

function renderSuggestion(suggestion) {
    return (
        <span>{suggestion.key} {suggestion.doc_count}</span>
    );
}

function renderSectionTitle(section) {
    return (
        <strong>{section.title}</strong>
    );
}

export class SearchkitAutosuggest extends SearchkitComponent {

    static defaultProps = {
        accessors:[]
    }
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            isLoading:false,
            suggestions: []
        };

    }

    componentDidMount(){
        this.datasourceManager = new DatasourceManager(
            this.searchkit, this.props.sources)        
    }

    onChange = (event, { newValue, method }) => {
        if(method==='type'){
            this.setState({
                value: newValue
            });
        }
        
    };

    renderInputComponent=(inputProps)=> {
        let props = {
            ...inputProps,
            className: inputProps.className + " sk-search-box__text"
        }
        return (
            <div className="sk-search-box">
                <div class="sk-search-box__icon"></div>
                <input {...props} />
                {this.state.loading && (
                    <div data-qa="loader" 
                        class="sk-search-box__loader sk-spinning-loader is-hidden"></div>
                )}
            </div>
        )
    }


    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = async ({ value }) => {
        if(value.length >= 2) {
            this.setState({
                isLoading: true
            })
            let suggestions = await this.datasourceManager.search(value)
            this.setState({ suggestions, isLoading: false })                
        } else {
            this.setState({suggestions:[]})
        }
        
    };

    onSuggestionSelected = (e, {suggestion})=> {
        console.log("Selected", suggestion)
        this.setState({
            value:suggestion.select() || ""
        })
    }

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };
    render(){
        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: 'search',
            value,
            onChange: this.onChange
        };        

        return (
            <Autosuggest
                className="sk-searchbox"
                multiSection={true}
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                onSuggestionSelected={this.onSuggestionSelected}
                highlightFirstSuggestion={false}
                getSuggestionValue={prop("key")}
                getSectionSuggestions={prop("results")}
                renderSectionTitle={renderSectionTitle}
                renderInputComponent={this.renderInputComponent}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
        );
    }
}