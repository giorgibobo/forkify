import Search from "./models/search";
import { clearLoader, elements, renderLoader } from "./view/base";
import * as searchview from "./view/searchview";

const state = {};
window.state = state;


const controlSearch = async () => {

    const query = searchview.getInput();

    if(query){  
        
        searchview.clearInput();
        searchview.clearResults();
        renderLoader(elements.searchResList);

        state.search = new Search(query);
        await state.search.getResults()

        clearLoader();
        searchview.renderResult(state.search.result)
    }    
}


elements.searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    controlSearch();

})

elements.searchResPages.addEventListener("click", e => {
    const btn = e.target.closest(".btn-inline");

    if(btn){
        const goToPage = +btn.dataset.goto;
        searchview.clearResults();
        searchview.renderResult(state.search.result, goToPage);
    }

});
