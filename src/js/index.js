import Recipe from "./models/recipe";
import Search from "./models/search";
import { clearLoader, elements, renderLoader } from "./view/base";
import * as searchview from "./view/searchview";
import * as recipeView from "./view/recipeView";

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


//recipe
const controlRecipe = async () => {
    const id = window.location.hash.replace("#", "");

    if(id){
        //prepare UI
        recipeView.clearRecipe();        

        renderLoader(elements.recipe);

        state.search && searchview.activeLinkStyle(id);


        //create new recipe object
        state.recipe = new Recipe(id);

        try {          
            await state.recipe.getRecipe();
        } catch (error) {
            alert("recipe error")            
        }
        
        state.recipe.parseIngredients();

        //calculate time and servings
        state.recipe.calcTime();
        state.recipe.calcServings();

        clearLoader();

        recipeView.renderRecipe(state.recipe);

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


window.addEventListener("hashchange", () => {
    controlRecipe();
})

window.addEventListener("load", () => {
    controlRecipe();
})
