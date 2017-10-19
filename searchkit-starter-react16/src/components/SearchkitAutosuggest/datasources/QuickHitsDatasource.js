import { MultiMatchQuery, TopHitsMetric, FilterBucket} from "searchkit"
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
        return query.setAggs(
            FilterBucket(
                this.options.id, MultiMatchQuery(queryString,{
                    type:"phrase_prefix",
                    fields:["title"]
                }), 
                TopHitsMetric('tophits', {
                    size:3, 
                    _source:['title', 'imdbId']
                })            
            )
        )
    }

    getGroupedResult(results){
        let path = [
            'aggregations',
            this.options.id, 'tophits', 'hits', 'hits'
        ]
        let items = map(get(results, path, []), (item)=> {
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