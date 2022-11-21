const LAT_LONG = {
    kathmandu: [27.7172, 85.324],
};

const mountains = {
    mount_everest: [27.9881, 86.9253],
    kanchenjunga: [27.7167, 88.1469],
    dhaulagiri: [28.7041, 83.5195],
    annapurna: [28.5964, 83.8208],
    manaslu: [28.5539, 84.5499],
    lhotse: [27.9881, 86.9253],
    makalu: [27.7667, 87.0667],
    cho_o_yu: [28.0944, 86.6611],
    shishapangma: [28.0175, 86.9225],
    annapurna_ii: [28.6358, 83.7892],
};

const images = {
    mount_everest:
        "https://media.architecturaldigest.com/photos/5af30475c29da93330bbfe90/master/pass/GettyImages-478627080.jpg",
    kanchenjunga:
        "https://assets.cntraveller.in/photos/60b9eff9010276881eb4d338/1:1/w_1063,h_1063,c_limit/kanchenjungalead.jpg",
    dhaulagiri:
        "https://www.adventureconsultants.com/assets/Uploads/Himalaya/Nepal-Himalaya/Dhaulagiri-and-Circuit-Trek/Dhaulagiri-17-0755.JPG",
    annapurna:
        "https://img.traveltriangle.com/blog/wp-content/uploads/2018/11/cover-for-Annapurna-Base-Camp-Trek.jpg",
    manaslu:
        "https://www.nepalfootprintholiday.com/wp-content/uploads/2022/06/manaslu-trek-photo.webp",
    lhotse: "https://upload.wikimedia.org/wikipedia/commons/7/72/Lhotse-fromChukhungRi.jpg",
    makalu: "https://s3.amazonaws.com/www.explorersweb.com/wp-content/uploads/2021/12/03142645/IMG_8374.jpg",
    cho_o_yu:
        "https://www.tibettravel.org/uploads/allimg/131217/1-13121G32008.jpg",
    shishapangma:
        "https://www.summitclimb.com/uploads/slides/images/slide_1588830978_Shisha-Pangma.jpg",
    annapurna_ii:
        "https://www.gokyotreksnepal.com/wp-content/uploads/2021/10/Annapurna-II.jpg",
};

window.onload = async function () {
    const map = L.map("map").setView(LAT_LONG.kathmandu, 8);
    L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker(LAT_LONG.kathmandu).addTo(map).bindPopup("Kathmandu")

    for (let mountain in mountains) {
        L.marker(mountains[mountain], {
            icon: L.icon({
                iconUrl:
                    "https://cdn-icons-png.flaticon.com/512/3105/3105646.png",
                iconSize: [30, 30],
            }),
        })
            .addTo(map)
            .bindPopup(
                `<h3>${mountain.replace(/_/g, " ")}</h3><img src="${
                    images[mountain]
                }" width="200px" />`
            );
    }

    const districtGeoJson = await loadJson();
    L.geoJSON(districtGeoJson, {
        style: function (feature) {
            return { color: "#ff7800", weight: 2, fillOpacity: 0 };
        },
    }).addTo(map);
};

const loadJson = async () => {
    const districtGeoJson = await (await fetch("district.geojson")).json();
    return districtGeoJson;
};
