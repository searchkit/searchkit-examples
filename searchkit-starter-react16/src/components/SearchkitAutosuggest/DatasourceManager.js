import { SearchkitDatasource } from "./SearchkitDatasource"
const each = require("lodash/each")
const flatten = require("lodash/flatten")
const map = require("lodash/map")

export class DatasourceManager {
    constructor(searchkit, sources){
        this.searchkit = searchkit
        this.searchkitDatasource = new SearchkitDatasource(searchkit)

        this.sources = [this.searchkitDatasource]
        each(sources, (source)=> {
            if(source.isSearchkitSource()){
                this.searchkitDatasource.addSource(source)
            } else {
                this.sources.push(source)
            }
        })    
    }


    async search(query){
        let results = await Promise.all(map(this.sources, (source)=> {
            return source.search(query)
        }))
        results = flatten(results)
        return results
    }
}