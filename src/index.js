async function fetchWithToken(title) {
    try {
        let url = `https://www.omdbapi.com/?apikey=abb7cdf7&s=${encodeURIComponent(title)}`;

        const response = await fetch(url);
        const data = await response.json();
        const resultsContainer = document.getElementById("results");

        if (data.Response === "True") {
            let moviesHtml = '<div class="row">';
            for (const movie of data.Search) {
                const poster = movie.Poster !== "N/A" ? movie.Poster : "https://raw.githubusercontent.com/MatinGhanbari/MovieHub/refs/heads/main/assets/images/default.png";
                const imdbID = movie.imdbID.replace("tt", "");

                moviesHtml += `
                            <div class="col-6 col-md-4 col-lg-2 mb-4 glass-background">
                                <div class="glass-card">
                                    <a href="${poster}" target="_blank">
                                        <img src="${poster}" class="card-img-top" alt="${movie.Title}" onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/MatinGhanbari/MovieHub/refs/heads/main/assets/images/default.png';">
                                    </a>
                                    <div class="card-body">
                                        <div>
                                            <h4 class="card-title" style="margin-top:10px">${movie.Title}</h4>
                                            <p class="card-text">Year: ${movie.Year}</p>
                                        </div>
                                        <div style="min-width:90%">
                                            ${await generateDownloadLinks(imdbID, movie.Year, movie.Type)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
            }
            moviesHtml += "</div>";
            resultsContainer.innerHTML = moviesHtml;
            resultsContainer.scrollIntoView({behavior: "smooth"});
        } else {
            resultsContainer.innerHTML = '<div class="alert alert-danger">Movie not found!</div>';
        }
    } catch (error) {
        console.error("Error: ", error);
        document.getElementById("results").innerHTML = '<div class="alert alert-danger">Error: ' + error.message + "</div>";
    }
}


async function generateDownloadLinks(imdbID, year, type) {
    if (type === "movie") {
        const originalDownloadLink = `https://tokyo.saymyname.website/Movies/${year}/${imdbID}/`;
        const backupDownloadLink = `https://berlin.saymyname.website/Movies/${year}/${imdbID}/`;

        let linksHtml = '';
        linksHtml += `<a href="${originalDownloadLink}" target="_blank" class="btn btn-primary mb-2">Download</a><br>`;
        linksHtml += `<a href="${backupDownloadLink}" target="_blank" class="btn btn-secondary mb-2">Backup Link</a><br>`;

        return linksHtml;
    } else if (type === "series") {
        return generateSeriesDownloadLinks(imdbID);
    }
    return "";
}


async function generateSeriesDownloadLinks(imdbID) {
    let seasonsHtml = '<div class="accordion" id="seasonsAccordion">';
    
    var movieData = await getMovieFullDetails(imdbID);
    var seasons = movieData['totalSeasons'];

    for (let i = 1; i <= seasons; i++) {
        links = await generateQualityLinks(imdbID, i);

        seasonsHtml += `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading${imdbID}-${i}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${imdbID}-${i}" aria-expanded="false" aria-controls="collapse${imdbID}-${i}">
                        Season ${i}
                    </button>
                </h2>
                <div id="collapse${imdbID}-${i}" class="accordion-collapse collapse" aria-labelledby="heading${imdbID}-${i}" data-bs-parent="#seasonsAccordion">
                    <div class="accordion-body">
                        ${links}
                    </div>
                </div>
            </div>
        `;
    }
    seasonsHtml += "</div>";
    return seasonsHtml;
}

async function getMovieFullDetails(imdbID) {
    
    try {
        let url = `https://www.omdbapi.com/?apikey=abb7cdf7&i=tt${imdbID}&plot=full`;

        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

async function generateQualityLinks(imdbID, season) {
  let qualityLinks = "";
  for (let quality = 1; quality <= 4; quality++) {
    const downloadLink = `https://subtitle.saymyname.website/DL/filmgir/?i=tt${imdbID}&f=${season}&q=${quality}`;
    qualityLinks += `<a href="${downloadLink}" target="_blank" class="btn btn-primary mb-2">S${season} - Quality ${quality}</a><br>`;
  }
  return qualityLinks;
}

document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const resultsDiv = document.getElementById('results');

    if (title.trim())
        resultsDiv.innerHTML = `<embed src="https://raw.githubusercontent.com/MatinGhanbari/MovieHub/refs/heads/main/assets/svg/infinite-spinner.svg"/> Searching: ${title}...`;
    else 
        resultsDiv.innerHTML = 'Enter the movie name: ';
});

document.getElementById("searchForm")
        .addEventListener("submit", function (event) {
            event.preventDefault();
            const title = document.getElementById("title").value.trim();
            fetchWithToken(title).then(r => {
            });
        });