import { 
    ImmutableQuery,FacetAccessor
} from "searchkit"
const map = require("lodash/map")
const get = require("lodash/get")

export class RefinementSuggestAccessor extends FacetAccessor {

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

    buildOwnQuery(query){
        return query
    }    

    async search(query){
        let sharedQuery = this.searchkit.accessors.buildSharedQuery(new ImmutableQuery())
        this.options.include = this.createRegexQuery(query)
        let searchQuery = super.buildOwnQuery(sharedQuery)
            .setSize(0)        

        let results = await this.searchkit.transport.search(
            searchQuery.getJSON())    
        
        return get(results, [
            "aggregations", this.uuid, this.options.field, "buckets"
        ], [])        
    }
}