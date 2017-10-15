import { 
    FilterBasedAccessor, ArrayState, ImmutableQuery, 
    TermsBucket, FilterBucket, TermQuery,
    BoolShould, BoolMust
} from "searchkit"
const map = require("lodash/map")
const get = require("lodash/get")

export class RefinementSuggestAccessor extends FilterBasedAccessor {
    state = new ArrayState()    
    constructor(key, options) {
        super(options.id)
        this.options = options
        this.options.operator = this.options.operator || "OR"
    }

    sanitizeQuery(query){
        return query.replace(/[^\w\s]/g, "").toLowerCase()        
    }

    createRegexQuery(query){
        query = this.sanitizeQuery(query)
        query = map(query, (char)=> {
            if(/[a-z]/.test(char)){
                return `[${char}${char.toUpperCase()}]`
            }
            return char
        }).join("")        
        return `.*${query}.*`
    }


    isOrOperator() {
        return this.options.operator === "OR"
    }

    getBoolBuilder() {
        return this.isOrOperator() ? BoolShould : BoolMust
    }

    buildSharedQuery(query) {
        var filters = this.state.getValue()
        var filterTerms = map(filters, (filter) => {
            return TermQuery(this.options.field, filter)
        })
        var selectedFilters = map(filters, (filter) => {
            return {
                name: this.options.title || this.translate(this.options.field),
                value: this.translate(filter),
                id: this.options.id,
                remove: () => this.state = this.state.remove(filter)
            }
        })
        var boolBuilder = this.getBoolBuilder()
        if (filterTerms.length > 0) {
            query = query.addFilter(this.uuid, boolBuilder(filterTerms))
                .addSelectedFilters(selectedFilters)
        }

        return query
    }

    async search(query){
        let sharedQuery = this.searchkit.accessors.buildSharedQuery(new ImmutableQuery())
        
        let searchQuery = new ImmutableQuery()
        let regexQuery = this.createRegexQuery(query)
        let excludedKey = (this.isOrOperator()) ? this.uuid : undefined
        searchQuery = searchQuery.setAggs(
            FilterBucket(
                this.uuid, 
                sharedQuery.getFiltersWithoutKeys(excludedKey),
                TermsBucket(this.options.field, this.options.field, {
                    include: regexQuery
                })
            )
        ).setSize(0)        


  
        let results = await this.searchkit.transport.search(
            searchQuery.getJSON())    
        
        this.suggestResults = get(results, [
            "aggregations", this.uuid, this.options.field, "buckets"
        ], [])
        return this.suggestResults
    }
}