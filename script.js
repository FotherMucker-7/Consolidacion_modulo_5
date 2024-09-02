let cardsAdded = [0, 0, 0];
const sectionColors = ['#ff0000', '#00ff2a', '#00aaff'];
let pendingRequests = [null, null, null];

function createCard(name, height, mass, color) {
    return `
        <div class="col-12 col-md-6 col-lg-4 small-card">
            <div class="single-timeline-content d-flex wow fadeInLeft" data-wow-delay="0.3s">
                <div class="timeline-icon">
                    <i class="fa fa-user-circle" aria-hidden="true" style="color: ${color};"></i>
                </div>
                <div class="timeline-text">
                    <h6>${name}</h6>
                    <p>Estatura: <span>${height}</span> cm, Peso: <span>${mass}</span> kg</p>
                </div>
            </div>
        </div>`;
}

function addCardToSection(sectionIndex, data) {
    if (cardsAdded[sectionIndex] < 5) {
        const cardHTML = createCard(data.name, data.height, data.mass, sectionColors[sectionIndex]);
        document.querySelector(`#additional-cards-${sectionIndex + 1}`).insertAdjacentHTML('beforeend', cardHTML);
        cardsAdded[sectionIndex]++;
    }
}

function fetchCharacterData(sectionIndex, apiIndex) {
    if (pendingRequests[sectionIndex]) pendingRequests[sectionIndex].abort();

    const controller = new AbortController();
    const signal = controller.signal;
    pendingRequests[sectionIndex] = controller;

    fetch(`https://swapi.dev/api/people/${apiIndex}/`, { signal })
        .then(response => response.json())
        .then(data => {
            addCardToSection(sectionIndex, data);
            pendingRequests[sectionIndex] = null;
        })
        .catch(error => {
            if (error.name !== 'AbortError') {
                console.error('Error fetching data:', error);
            }
        });
}

document.querySelectorAll('[id^="sequence-"]').forEach((sequence, index) => {
    sequence.addEventListener('mouseover', () => {
        if (cardsAdded[index] < 5) {
            const apiIndex = index * 5 + cardsAdded[index] + 1;
            fetchCharacterData(index, apiIndex);
        }
    });
});
