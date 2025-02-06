const bsearch_button = document.getElementById('bsearch_button');
const search_bar_container = document.getElementById('search_bar_container');
const search_bar = document.getElementById('search_bar');
const results_container = document.getElementById('results_container');
const loader_spinner = document.getElementById('loader_spinner');
const search_results_section = document.getElementById('search_results_section');
const menu = document.getElementById('menu');
const close_menu = document.getElementById('close_menu');

close_menu.addEventListener('click', ev => {
    console.log("test");
    menu.style.display = "none !important;"
});

bsearch_button.addEventListener('click', () => {
    results_container.scrollIntoView({behavior: "smooth"});
    search_bar.value = '';
    search_bar.focus();
});

search_bar.addEventListener('keydown', ev => {
    if (ev.key === "Enter") {
        ev.preventDefault();
        let title = search_bar.value.trim();

        if (title) {
            SearchMoviesByTitle(title);
        } else {
            search_bar.value = title;
        }
    }
});

async function FetchMoviesData(title, page = 1) {
    let base_url = `https://www.omdbapi.com/?apikey=abb7cdf7&s=${encodeURIComponent(title)}&page=${page}`;
    const response = await fetch(base_url);
    return await response.json();
}

async function SearchMoviesByTitle(title, page = 1) {
    loader_spinner.style.display = 'block';
    search_results_section.style.display = 'block';

    try {
        let data = await FetchMoviesData(title, page);
        if (data.Response !== "True") {
            results_container.innerHTML = '<div class="alert alert-danger"><i class="fa-solid fa-film"></i> Movie not found!</div>';
            search_bar.style.borderColor = 'red';
            search_bar.classList.add('invalid');
            setTimeout(() => {
                search_bar.classList.remove('invalid');
            }, 500);
        } else {
            let moviesHtml = '<div class="MuiGrid-root MuiGrid-container css-2vcxjca-MuiGrid-root" id="results">';
            moviesHtml += `
            
            `;
            for (const movie of data.Search) {
                if (movie.Type !== "movie") continue; //Just Movies
                const poster = movie.Poster !== "N/A" ? movie.Poster : "../static/images/default-cover.jpg";
                const imdbID = movie.imdbID.replace("tt", "");
                moviesHtml += `
    <div class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-lg-6 MuiGrid-grid-xl-5 css-1ycjkpa-MuiGrid-root">
        <div class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root css-a1zovi-MuiPaper-root-MuiCard-root">
            <div class="MuiBox-root css-7wmvu8">
                <div class="MuiBox-root css-1gu079p">
                    <div>
                        <div class="apexcharts-canvas apexchartsbpz3kk6ki apexcharts-theme-"  style="">
                            <div style="">
                                <img class="cover-image" src="${poster}">
                            </div>
                            <div class="apexcharts-yaxistooltip apexcharts-yaxistooltip-0 apexcharts-yaxistooltip-left apexcharts-theme-dark"><div class="apexcharts-yaxistooltip-text"></div></div>
                        </div>
                    </div>
                </div>
                <div style="display: flex;justify-content: space-between;align-content: center;align-items: flex-start">
                    <div style="padding-right: 20px !important;">
                        <span class="MuiTypography-root MuiTypography-lg css-a3jw3h-MuiTypography-root">${movie.Title}</span>
                        <div class="MuiBox-root css-14l70i8"><span
                                class="MuiTypography-root MuiTypography-button css-1t3vklz-MuiTypography-root">${movie.Year} <span
                                class="MuiTypography-root MuiTypography-button css-dsc10y-MuiTypography-root"></span></span>
                        </div>
                    </div>
                    <div style="display: flex;justify-content: center;align-items: center;align-content: flex-start">
                        <a href="https://tokyo.saymyname.website/Movies/${movie.Year}/${imdbID}/" target="_blank">
                            <div class="hover-button MuiBox-root css-1std5id2"><span
                                    class="material-icons-round notranslate MuiIcon-root MuiIcon-fontSizeDefault css-75zff6-MuiIcon-root"
                                    aria-hidden="true">download</span></div>
                        </a>
                        <a href="https://dl.subtitlestar.com/dlsub/${movie.Title.trim().replace(/\s+/g, '-').replace(':', '').toLowerCase()}-${movie.Year}-All.zip"
                           target="_blank">
                            <div class="hover-button MuiBox-root css-1std5id2"><span
                                    class="material-icons-round notranslate MuiIcon-root MuiIcon-fontSizeDefault css-75zff6-MuiIcon-root"
                                    aria-hidden="true">closed_caption</span></div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
                        `;
            }
            moviesHtml += "</div>";
            results_container.innerHTML = moviesHtml;
            results_container.scrollIntoView({behavior: "smooth"});
        }
    } catch (error) {
        console.error("Error: ", error);
        document.getElementById("results").innerHTML = '<div class="alert alert-danger">Error: ' + error.message + "</div>";
    }
    loader_spinner.style.display = 'none';
}