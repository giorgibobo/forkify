import Recipe from "./models/recipe";
import Search from "./models/search";
import { clearLoader, elements, renderLoader } from "./view/base";
import * as searchview from "./view/searchview";
import * as recipeView from "./view/recipeView";
import * as listView from "./view/listView";
import * as likesview from "./view/likesview";
import List from "./models/list";
import Like from "./models/like";


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
        recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    }
}

//shopping list
const controlList = () => {
    //create new list
    if(!state.list) state.list = new List();

    elements.shopping.innerHTML = "";

    //add each ingredients
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItems(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

const controlLike = () => {
    if(!state.likes) state.likes = new Like();

    const curentId = state.recipe.id;

    if(!state.likes.isLiked(curentId)){
        //add like to the state
        const newLike = state.likes.addLike(curentId, 
            state.recipe.title, 
            state.recipe.author, 
            state.recipe.img
        );

        //toggle button
        likesview.toggleLikeBtn(true);

        likesview.renderLike(newLike);

    }else{
        //delete like from the state
        state.likes.deleteLike(curentId);

        //toggle button
        likesview.toggleLikeBtn(false);

        //delete like from UI
        likesview.deleteLike(curentId);
    }
}


//delete and update shopping list
elements.shopping.addEventListener("click", e => {
    const id = e.target.closest(".shopping__item").dataset.itemid;
    
    if(e.target.matches(".shopping__delete, .shopping__delete *")){
        //delete items
        state.list.deleteItem(id);
        listView.deleteItem(id);

    }else if(e.target.matches(".shopping__count__input")){
        //update item
        const newValue = +e.target.value;
        state.list.updateItem(id, newValue);
    }
})


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
    state.likes = new Like();

    //restore likes
    state.likes.readStorage();

    controlRecipe();
})

elements.recipe.addEventListener("click", e => {
    if(e.target.matches(".btn-decrease, .btn-decrease *")){
        //button decrease
        if(state.recipe.servings > 1){
            state.recipe.updateServingIngredient("dec");
            recipeView.updateServingIngredient(state.recipe);
        }
       
    }else if(e.target.matches(".btn-increase, .btn-increase *")){
        //button increase
        state.recipe.updateServingIngredient("inc");
        recipeView.updateServingIngredient(state.recipe);
    }else if(e.target.matches(".recipe__btn__add, .recipe__btn__add *")){
        controlList();

    }else if(e.target.matches(".recipe__love, .recipe__love *")){
       //like controler
       controlLike(); 
    }
})
