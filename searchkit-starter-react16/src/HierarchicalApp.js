import React, { Component } from 'react'
import { extend } from 'lodash'
import {
    SearchkitManager, SearchkitProvider,
    RefinementListFilter, Pagination,
    HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
    ResetFilters, RangeFilter, NumericRefinementListFilter,
    ViewSwitcherHits, ViewSwitcherToggle, DynamicRangeFilter,
    InputFilter, GroupedSelectedFilters,
    Layout, TopBar, LayoutBody, LayoutResults, SearchBox,
    FacetAccessor, FilteredQuery, TermQuery, BoolMust,
    ActionBar, ActionBarRow, SideBar, HierarchicalRefinementFilter, Hits
} from 'searchkit'
import './index.css'

import { SearchBoxAutoComplete } from "./components/SearchboxAutocomplete/SearchboxAutocomplete"
import { RefinementSuggest } from "./components/RefinementFilterSuggest/RefinementSuggest"
import { ReactAutosuggestAdapter } from "./components/RefinementFilterSuggest/adapters/react-autosuggest"
import { SearchkitAutosuggest } from "./components/SearchkitAutosuggest/SearchkitAutosuggest"
import {
    FacetFilterDatasource, QuickHitsDatasource, HierarchicalRefinementDatasource
} from "./components/SearchkitAutosuggest/datasources"
const host = "http://demo.searchkit.co/api/taxonomy"
// const host = "http://localhost:9200/movies"
const searchkit = new SearchkitManager(host)

// searchkit.addDefaultQuery((query)=> {
//   return query.addQuery(
//     BoolMust([
//       TermQuery("type", "news"),
//       TermQuery("language", "en"),
//     ])
//   )
// })

const TaxonomyHitsItem = (props) => {
    const { result, bemBlocks } = props
    return (
        <div className={bemBlocks.item().mix(bemBlocks.container("item"))}>
            {result._source.name}
        </div>
    )
}


class App extends Component {
    render() {
        return (
            <SearchkitProvider searchkit={searchkit}>
                <Layout>
                    <TopBar>
                        <div className="my-logo">Searchkit Acme co</div>
                        {/* <SearchBox autofocus={true} autoCompleteField="suggest" searchOnChange={false}        prefixQueryFields={["actors^1","type^2","languages","title^10"]}/> */}
                        <SearchkitAutosuggest sources={[
                            new HierarchicalRefinementDatasource({accessorId:'categories'})
                            // new QuickHitsDatasource({ id: "quickhits", title: "Suggestions" }),
                            // new FacetFilterDatasource({ accessorId: "countries" }),
                            // new FacetFilterDatasource({ accessorId: "actors" }),
                            // new FacetFilterDatasource({ id: "genres", field: "genres.raw", title: "Genres" })
                        ]} />
                    </TopBar>

                    <LayoutBody>

                        <SideBar>
                            <HierarchicalRefinementFilter field="taxonomy" id="categories" title="Region" startLevel={2} />
                            <RefinementListFilter
                                field="taxonomy.value"
                                fieldOptions={{ type: 'nested', options: { path: "taxonomy" } }}
                                size={10}
                                id="NestedTest" title="Nested Test" />
                            <NumericRefinementListFilter
                                field="taxonomy.level"
                                options={[
                                    { title: "All" },
                                    { title: "1", from: 1, to: 2 },
                                    { title: "2", from: 2, to: 3 },
                                    { title: "3", from: 3 }
                                ]}
                                fieldOptions={{ type: 'nested', options: { path: "taxonomy" } }}
                                id="NestedNumeric" title="Nested Numeric" />
                            <RangeFilter min={1} max={6} field="taxonomy.level" id="levelRange"
                                title="Taxonomy level range" fieldOptions={{ type: "nested", options: { path: "taxonomy" } }} />

                            <DynamicRangeFilter field="taxonomy.level" id="levelRangeDynamic"
                                title="Taxonomy level Dynamic range" fieldOptions={{ type: "nested", options: { path: "taxonomy" } }} />
                        </SideBar>
                        <LayoutResults>
                            <ActionBar>

                                <ActionBarRow>
                                    <HitsStats translations={{
                                        "hitstats.results_found": "{hitCount} results found"
                                    }} />
                                    <ViewSwitcherToggle />
                                    <SortingSelector options={[
                                        { label: "Relevance", field: "_score", order: "desc" },
                                        { label: "Latest Releases", field: "released", order: "desc" },
                                        { label: "Earliest Releases", field: "released", order: "asc" }
                                    ]} />
                                </ActionBarRow>

                                <ActionBarRow>
                                    <GroupedSelectedFilters />
                                    <ResetFilters />
                                </ActionBarRow>

                            </ActionBar>
                            <Hits hitsPerPage={10} mod="sk-hits-list" itemComponent={TaxonomyHitsItem} />

                            <NoHits suggestionsField={"title"} />
                            <Pagination showNumbers={true} />
                        </LayoutResults>

                    </LayoutBody>
                </Layout>
            </SearchkitProvider>
        );
    }
}

export default App;
