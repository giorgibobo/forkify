import axios from "axios"

export default class Recipe{
    constructor(id){
        this.id = id
    }

    async getRecipe(){
        try {
             const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients; 
        } catch (error) {
            alert(error)            
        }      
    }

    parseIngredients(){

        const newIngredients = this.ingredients.map(el => {
            const unitsLong = ["tablespoons", "tablespoon", "ounces", "ounce", "teaspoons", "teaspoon", "cup"];
            const unitsShort = ["tbsp", "tbsp", "oz", "oz", "tsp", "tsp", "cup"];
        
            //1) uniform unit
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, index) => {
                ingredient = ingredient.replace(unit, unitsShort[index])

            })

            //2)remove paranethenses
            ingredient = ingredient.replace(/ *\(([^)]*)\) */g, " ");
            
            return ingredient;
            
        });

        this.ingredients = newIngredients;      
        
       
    }
}