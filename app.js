
let popular_result = []
popular_lib = [
    "Deadpool+Wolverine",
    "Blink Twice",
    "it ends with us",
    "Will harper",
    "Fly+Me+to+the+Moon",
    "Babes",
    "Gunner",
    "Wolfs",
    "Brats",
    "madame web",
    "slay",
    "Inside out 2",
    "Fall+guy",
    "Dune part two",
    "furiosa",
    "ghostlight",
    "challengers",
    "Descendants+3",
    "beetlejuice",
    "Young+woman+and+the+sea",
    "love lies bleeding",
    "civil war",
    "substance",
    "abigail",
    "Kingdom of the planet of the apes",
    "Hit man",
    "wicked",
    "Red One",
    "Gladiator II",
    "poor things",
    "all+of+us+strangers"
]


async function api_proc(title, id) {
    const respon = await fetch(`https://www.omdbapi.com/?t=${title}&apikey=e09eb1d6`)
    const data = await respon.json()

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: id,
                    title: data.Title,
                    year: data.Year,
                    audience_rated: data.Rated,
                    release_date: data.Released,
                    poster_url: data.Poster,
                    rating: parseFloat(data.imdbRating),
                    plot: data.Plot

                }
            ])
        }, 1)
    })
}

async function dictionary_json(title, id) {

    const popular_movie = await api_proc(title, id)

    return popular_movie[0]
}


async function here(library) {

    for (i = 0; i <= library.length - 1; i++) {

        popular_movie = await dictionary_json(library[i], i)

        popular_result.push(popular_movie)

    }
    return (popular_result)
}

async function renderMovies(filter) {

    const moviesWrapper = document.querySelector(".main__shows--wrapper")

    if (popular_result.length < 1) {
        console.log(popular_result)
        popular_result = await here(popular_lib)

    }


    if (filter === "LOW_TO_HIGH") {
        popular_result.sort((a, b) => a.rating - b.rating)

    } else if (filter === "HIGH_TO_LOW") {
        popular_result.sort((a, b) => b.rating - a.rating)

    }
    else if (filter === "ALPHA") {
        popular_result.sort((a, b) => a.title.localeCompare(b.title))
    }
    else if (filter === "ALPHA_REVERSE") {
        popular_result.sort((b, a) => a.title.localeCompare(b.title))
        console.log(popular_result)
    }

    const movieHTML = popular_result.map((movie) => {
        return `<div class="show__wrapper">
        <figure class="show__img--wrapper">
        <img src="${movie.poster_url}" onclick="fromMain(${movie.id})" class="show__img">
        </figure>
        <h3>${movie.title}</h3>
        <h4>${movie.rating}</h4>
        </div>`
    }).slice(0, 21).join("")

    // render 10 movies default

    moviesWrapper.innerHTML = movieHTML

}

renderMovies('None')

async function searchBar(event) {
    event.preventDefault()
    const search_keyword = document.getElementById("search_field").value

    const this_data = await api_search(search_keyword)


    renderSearchResult(this_data)
}

async function api_search(title) {
    const respon = await fetch(`https://www.omdbapi.com/?t=${title}&apikey=e09eb1d6`)
    const data = await respon.json()


    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    title: data.Title,
                    year: data.Year,
                    audience_rated: data.Rated,
                    release_date: data.Released,
                    poster_url: data.Poster,
                    rating: data.imdbRating,
                    plot: data.Plot,
                    cast: data.Actors
                }
            ])
        }, 1)
    })
}


function renderSearchResult(movie) {
    document.querySelector(".floating__module--wrapper").scrollIntoView(true)
    const searchedMovie = document.querySelector(".module__search--wrapper")


    const searchedHTML = movie.map((data) => {
        return `<div class="search__info--wrapper">
                    <figure class="search__img--wrapper">
                        <img src="${data.poster_url}" class="search__img">
                    </figure>
                    <div class="search__info--main">
                        <div>
                            <h1>${data.title}</h1>
                            <h4>${data.rating}</h4>
                            <h3>${data.cast}</h3>
                        </div>
                
                        <div class="search__info--para">
                            <p>About Film: ${data.plot}</p>

                        </div>
                    </div>
                </div>`
    })
    recentString(movie[0])


    searchedMovie.innerHTML = searchedHTML
}



let movieString = ""
localStorage.setItem('movie_string', movieString)

function recentString(movie) {

    movieToString = JSON.stringify(movie)

    movieString ? (movieString += ",," + movieToString) : (movieString += movieToString)


    localStorage.setItem('movie_string', movieString)

    renderRecent()
}

function renderRecent() {

    movieString = localStorage.getItem('movie_string')

    movieList = movieString.split(',,')

    movieListJSON = movieList.map(movie => JSON.parse(movie))

    recentMovie = document.querySelector(".recent__show--wrapper")

    recentHTML = movieListJSON.map((data) => {
        return `<div class="recent__shows">
                            <figure class="recent-show__img--wrapper">
                                <img src="${data.poster_url}" class="recent-show__img">
                            </figure>
                        </div>`
    })

    recentMovie.innerHTML = recentHTML

    console.log(movieListJSON)
    //movie = JSON.parse(movieString)
}

let isModalOpen = false
function toggleModal() {

    if (isModalOpen) {
        isModalOpen = false

        return document.body.classList.remove('modal--open')
    }
    isModalOpen = true
    document.body.classList += ' modal--open'
}

function fromMain(movie_id) {
    toggleModal()
    console.log(popular_result.length)
    for (i = 0; i <= popular_result.length - 1; i++) {
        if (popular_result[i].id === movie_id) {
            fromMainPopout([popular_result[i]])
        }
    }

}

async function fromMainPopout(dict) {

    // const search_keyword = dict.title

    console.log(dict)
    // this_data = await api_search(search_keyword)


    renderSearchResult(dict)
}


function filterMovies(event) {
    renderMovies(event.target.value)
}