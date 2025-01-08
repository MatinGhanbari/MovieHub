async function fetchWithToken(title) {
    try {
        let url = `https://www.omdbapi.com/?apikey=abb7cdf7&s=${encodeURIComponent(title)}`;

        const response = await fetch(url);
        const data = await response.json();
        const resultsContainer = document.getElementById("results");
        resultsContainer.innerHTML = "";

        if (data.Response === "True") {
            let moviesHtml = '<div class="row">';
            for (const movie of data.Search) {
                const poster = movie.Poster !== "N/A" ? movie.Poster : "https://raw.githubusercontent.com/MatinGhanbari/MovieHub/refs/heads/main/assets/images/default.png";
                const imdbID = movie.imdbID.replace("tt", "");

                moviesHtml += `
                            <div class="col-6 col-md-4 col-lg-2 mb-4 glass-background ">
                                <div class="glass-card">
                                    <a href="${poster}" target="_blank">
                                        <img src="${poster}" class="card-img-top" alt="${movie.Title}" onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/MatinGhanbari/MovieHub/refs/heads/main/assets/images/default.png';">
                                    </a>
                                    <div class="card-body">
                                        <h5 class="card-title">${movie.Title}</h5>
                                        <p class="card-text">Year: ${movie.Year}</p>
                                        ${await generateDownloadLinks(imdbID, movie.Year, movie.Type)}
                                    </div>
                                </div>
                            </div>
                        `;
            }
            moviesHtml += "</div>";
            resultsContainer.innerHTML = moviesHtml;

            resultsContainer.scrollIntoView({behavior: "smooth"});
        } else {
            resultsContainer.innerHTML = '<div class="alert alert-danger">Not found!</div>';
        }
    } catch (error) {
        console.error("Error: ", error);
        document.getElementById("results").innerHTML = '<div class="alert alert-danger">Error: ' + error.message + "</div>";
    }
}

document
    .getElementById("searchForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();
        const title = document.getElementById("title").value.trim();
        fetchWithToken(title).then(r => {
        });
    });

async function checkLinkAvailability(url) {
    const headers = {
        'accept': '*/*', 'cache-control': 'no-cache', 'pragma': 'no-cache',
    };

    try {
        const response = await fetch(url, {
            method: 'GET', headers: headers, credentials: 'include',
        });
        return response.status !== 404;
    } catch (error) {
        return false;
    }
}

async function generateDownloadLinks(imdbID, year, type) {
    if (type === "movie") {
        const originalDownloadLink = `https://tokyo.saymyname.website/Movies/${year}/${imdbID}/`;
        const backupDownloadLink = `https://berlin.saymyname.website/Movies/${year}/${imdbID}/`;

        let linksHtml = '';


        // const originalAvailable = await checkLinkAvailability(originalDownloadLink);
        // const backupAvailable = await checkLinkAvailability(backupDownloadLink);
        // if (originalAvailable) {
        //     linksHtml += `<a href="${originalDownloadLink}" class="btn btn-primary mb-2">Download</a><br>`;
        // }
        // if (backupAvailable) {
        //     linksHtml += `<a href="${backupDownloadLink}" class="btn btn-secondary mb-2">Download - Backup Link</a><br>`;
        // }
        // if (!originalAvailable && !backupAvailable) {
        //     linksHtml += `<span class="text-danger">Download links are unavailable</span><br>`;
        // }

        linksHtml += `<a href="${originalDownloadLink}" target="_blank" class="btn btn-primary mb-2">Download</a><br>`;
        linksHtml += `<a href="${backupDownloadLink}" target="_blank" class="btn btn-secondary mb-2">Backup Link</a><br>`;

        return linksHtml;
    } else if (type === "series") {
        return generateSeriesDownloadLinks(imdbID);
    }
    return "";
}


function generateSeriesDownloadLinks(imdbID) {
    let seasonsHtml = '<div class="accordion" id="seasonsAccordion">';
    for (let i = 1; i <= 4; i++) {
        seasonsHtml += `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading${imdbID}-${i}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${imdbID}-${i}" aria-expanded="false" aria-controls="collapse${imdbID}-${i}">
                        Season ${i}
                    </button>
                </h2>
                <div id="collapse${imdbID}-${i}" class="accordion-collapse collapse" aria-labelledby="heading${imdbID}-${i}" data-bs-parent="#seasonsAccordion">
                    <div class="accordion-body">
                        ${generateQualityLinks(imdbID, i)}
                    </div>
                </div>
            </div>
        `;
    }
    seasonsHtml += "</div>";
    return seasonsHtml;
}

function generateQualityLinks(imdbID, season) {
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

    if (title.trim()) {
        resultsDiv.innerHTML = `Searching: ${title}...`;

        // setTimeout(function () {
        //     resultsDiv.innerHTML = `Results: ${title}`;
        // }, 1000);
    } else {
        resultsDiv.innerHTML = 'Enter the movie name: ';
    }
});