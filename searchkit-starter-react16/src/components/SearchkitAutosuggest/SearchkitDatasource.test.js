import { SearchkitDatasource} from "./SearchkitDatasource"
import { SearchkitManager, FacetAccessor, QueryAccessor }  from "searchkit"

describe("SearchkitDatasource tests", ()=> {


    it("SearchkitDatasource should exist", ()=> {
        expect(SearchkitDatasource).toBeTruthy()
    })


    it("creates the correct query", async ()=> {
        let searchkit = new SearchkitManager("http://demo.searchkit.co/api/movies")
        let searchkitDatasource = new SearchkitDatasource(searchkit.transport)
        let actors = new FacetAccessor("actors", {
            field:"actors.raw",
            id:"actors" ,
            title:"Actors"           
        })
        let countries = new FacetAccessor("countries", {
            field: "countries.raw",
            id: "countries",
            title: "Countries"
        })

        searchkitDatasource.addFacetAccessor(actors)
        searchkitDatasource.addFacetAccessor(countries)        
        let results = await searchkitDatasource.search("Spa")        
        
        console.log(JSON.stringify(results, null, 2))

    })
})