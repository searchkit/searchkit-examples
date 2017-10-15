import { FilterBasedAccessor, ArrayState, ImmutableQuery, TermsBucket, FilterBucket} from "searchkit"

export class RefinementSuggestAccessor extends FilterBasedAccessor {
    state = new ArrayState()

    constructor(key, options) {
        super(options.id)
        this.options = options
    }


    async search(value){
        let sharedQuery = this.searchkit.accessors.buildSharedQuery(new ImmutableQuery())
        
        let query = new ImmutableQuery()
        query = query.setAggs(
            FilterBucket(
                this.uuid, 
                sharedQuery.getFilters(),
                TermsBucket(this.options.field, this.options.field, {
                    include:`.*${value}.*`
                })
            )
        )
        query = query.setSize(0)
  
        let results = await this.searchkit.transport.search(query.getJSON())    
    }
}