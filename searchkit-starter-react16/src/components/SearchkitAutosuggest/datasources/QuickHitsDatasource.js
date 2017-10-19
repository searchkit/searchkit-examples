import { MultiMatchQuery} from "searchkit"
const map = require("lodash/map")
const get = require("lodash/get")

export class QuickHitsDatasource {
    constructor(options){
        this.options = options
    }
    isSearchkitSource() {
        return true
    }

    configure(searchkit){
        this.searchkit = searchkit
    }

    search(query, queryString){

        return query.addQuery(MultiMatchQuery(queryString, {
            type:"phrase_prefix",
            fields:["title"]
        })).setSize(3).setSource(["title", "imdbId"])
    }

    getGroupedResult(results){
        let items = map(get(results, "hits.hits", []), (item)=> {
            return {
                key:item._source.title,
                select(){
                    let url = "http://www.imdb.com/title/" + item._source.imdbId
                    window.open(url, '_blank')                    
                }
            }
        })
        return {
            title:this.options.title,
            results:items
        }
    }
}