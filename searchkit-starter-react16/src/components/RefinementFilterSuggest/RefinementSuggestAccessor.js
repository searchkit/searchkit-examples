import { 
    ImmutableQuery,FacetAccessor
} from "searchkit"

import Utils from "../../Utils"

const get = require("lodash/get")


export class RefinementSuggestAccessor extends FacetAccessor {

    buildOwnQuery(query){
        return query
    }    

    async search(query){
        let sharedQuery = this.searchkit.accessors.buildSharedQuery(new ImmutableQuery())
        this.options.include = Utils.createRegexQuery(query)
        let searchQuery = super.buildOwnQuery(sharedQuery)
            .setSize(0)        

        let results = await this.searchkit.transport.search(
            searchQuery.getJSON())    
        
        return get(results, [
            "aggregations", this.uuid, this.options.field, "buckets"
        ], [])        
    }
}