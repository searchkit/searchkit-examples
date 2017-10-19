import { AccessorManager, ImmutableQuery, FacetAccessor } from "searchkit"
import Utils from "../../Utils"

const reduce = require("lodash/reduce")
const map = require("lodash/map")
const orderBy = require("lodash/orderBy")
const filter = require("lodash/filter")
const get = require("lodash/get")

export class SearchkitDatasource {

    constructor(searchkit){
        this.searchkit = searchkit
        this.transport = searchkit.transport
        this.sources = []   
    }

    addSource(source){
        source.configure(this.searchkit)
        this.sources.push(source)
    }

    async search(query=""){
        console.log(this.sources)
        let sharedQuery = this.searchkit.accessors.buildSharedQuery(new ImmutableQuery())
            .setSize(0)
        let searchQuery = reduce(this.sources, (searchQuery, source)=>{                        
            return source.search(searchQuery, query)
        }, sharedQuery)                
        this.results = await this.transport.search(searchQuery.getJSON())              
        return this.getGroupedResults()
    }

    getGroupedResults(){
        let results = map(this.sources, (source)=> {
            return source.getGroupedResult(this.results)            
        })
        results = filter(results, (item)=> {
            return item.results.length > 0
        })                
        return results
    }
}