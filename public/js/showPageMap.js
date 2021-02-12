
mapboxgl.accessToken = MapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
const marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(`<h5 class="mt-3">${campground.title}</h5><p>${campground.location}</p>`)
        .addTo(map)
    )
    .addTo(map);

map.addControl(new mapboxgl.NavigationControl());
