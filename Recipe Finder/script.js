const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const mealsContainer = document.getElementById("meals");
const errorContainer = document.getElementById("error-container");
const mealDetails = document.getElementById("meal-details");
const mealDetailsContent = document.querySelector(".meal-details-content");
const backBtn = document.getElementById("back-btn");
const themeToggle = document.querySelector('#checkbox');
const chips = document.querySelectorAll(".chip");

const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') themeToggle.checked = true;
}

themeToggle.addEventListener('change', (e) => {
    const theme = e.target.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});

async function searchMeals() {
    const term = searchInput.value.trim();
    if (!term) return;

    mealsContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase;">Consulting Catalogue...</p>`;
    
    try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
        const data = await res.json();

        if (!data.meals) {
            errorContainer.innerHTML = `<p style="text-transform: uppercase; font-size: 0.7rem; letter-spacing: 2px;">No results found for "${term}"</p>`;
            errorContainer.classList.remove("hidden");
            mealsContainer.innerHTML = "";
        } else {
            errorContainer.classList.add("hidden");
            displayMeals(data.meals);
        }
    } catch (err) {
        errorContainer.textContent = "Service temporarily unavailable.";
        errorContainer.classList.remove("hidden");
    }
}

function displayMeals(meals) {
    mealsContainer.innerHTML = meals.map(meal => `
        <div class="meal" onclick="getMealDetails('${meal.idMeal}')">
            <div class="meal-img-wrapper">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            </div>
            <div class="meal-info">
                <h3 class="meal-title">${meal.strMeal}</h3>
            </div>
        </div>
    `).join("");
}

async function getMealDetails(id) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await res.json();
    const meal = data.meals[0];
    
    const ingredients = [];
    for(let i=1; i<=20; i++) {
        if(meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== "") {
            ingredients.push(`${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`);
        }
    }

    mealDetailsContent.innerHTML = `
        <img src="${meal.strMealThumb}" class="meal-details-img">
        <h2 style="font-family: 'Cinzel', serif; font-size: 2.5rem; letter-spacing: 5px; color: var(--accent); margin-bottom: 30px;">${meal.strMeal}</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; border-bottom: 1px solid var(--accent-light); padding-bottom: 30px;">
            ${ingredients.map(ing => `<p style="font-size: 0.8rem; letter-spacing: 1px; text-transform: uppercase;">• ${ing}</p>`).join('')}
        </div>
        <div style="line-height: 2.2; font-weight: 300; font-size: 0.95rem; text-align: justify;">${meal.strInstructions.replace(/\n/g, '<br>')}</div>
    `;
    mealDetails.classList.remove("hidden");
    window.scrollTo({ top: mealDetails.offsetTop - 50, behavior: 'smooth' });
}

searchBtn.addEventListener("click", searchMeals);
searchInput.addEventListener("keypress", (e) => e.key === "Enter" && searchMeals());
chips.forEach(chip => chip.addEventListener("click", () => {
    searchInput.value = chip.dataset.category;
    searchMeals();
}));
backBtn.addEventListener("click", () => {
    mealDetails.classList.add("hidden");
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
