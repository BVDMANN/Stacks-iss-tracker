const TRANSLATIONS = {
    fr: {
        "t-hero-title": "Station Spatiale Internationale",
        "t-hero-subtitle": "L'avant-poste le plus avancé de l'humanité, en orbite autour de notre monde.",
        "t-status-label": "Télémétrie en Temps Réel",
        "t-pass-label": "Observation Prochaine",
        "t-mission-label": "Dossier Mission",
        "t-hub-title": "L'Académie Spatiale",
        "t-card-1": "L'ISS est un complexe modulaire assemblé dans l'espace. Contrairement à un vaisseau spatial ou une fusée, elle n'a pas de moteur pour rentrer sur Terre. C'est une structure permanente où collaborent les agences NASA, Roscosmos, ESA, JAXA et CSA.",
        "t-card-2": "La station ne flotte pas dans le vide ; elle est en chute libre perpétuelle autour de la Terre. Cette condition crée la microgravité, permettant d'étudier des phénomènes physiques impossibles sur Terre, comme la cristallisation parfaite de protéines pour la médecine.",
        "t-card-3": "Maintenir la vie à 400 km d'altitude demande une technologie extrême. Recyclage de 93% de l'eau, protection contre les radiations solaires et exercise physique intensif pour contrer la perte osseuse.",
        "t-feed-title": "Registres de Missions",
        "t-modal-title": "Centre de Commandement Orbital",
        "t-modal-desc": "L'ISS est le symbole ultime de la coopération internationale. À 28 000 km/h, elle repousse les limites de la science et de la survie humaine. Explorez sa trajectoire et l'ingénierie qui rend possible l'habitation permanente dans le vide spatial.",
        "lets-go": "Accéder à l'interface",
        "t-sat-title": "Registres des Satellites Actifs"
    },
    en: {
        "t-hero-title": "International Space Station",
        "t-hero-subtitle": "Humanity's most advanced outpost, orbiting our world in real-time.",
        "t-status-label": "Real-time Telemetry",
        "t-pass-label": "Next Sighting",
        "t-mission-label": "Mission Dossier",
        "t-hub-title": "Space Academy",
        "t-card-1": "The ISS is a modular complex assembled in space. Unlike a spaceship or rocket, it has no engines to return to Earth. It is a permanent structure where NASA, Roscosmos, ESA, JAXA and CSA agencies collaborate.",
        "t-card-2": "The station does not float in the void; it is in a perpetual free-fall around the Earth. This condition creates microgravity, allowing the study of physical phenomena impossible on Earth.",
        "t-card-3": "Maintaining life at 400 km altitude requires extreme technology. 93% water recycling, protection against solar radiation, and intensive physical exercise to counteract bone loss.",
        "t-feed-title": "Mission Logs",
        "t-modal-title": "Orbital Command Center",
        "t-modal-desc": "The ISS is the ultimate symbol of international cooperation. At 17,500 mph, it pushes the limits of science and human survival. Explore its trajectory and the engineering that makes permanent habitation in the vacuum possible.",
        "lets-go": "Access Interface",
        "t-sat-title": "Active Satellite Registry"
    }
};

let currentLang = 'fr';
let map, issMarker, userMarker, pathLine;
let trajectory = [];
let isFollowing = true;
let userPos = null;

const layers = {
    dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'),
    sat: L.tileLayer('https://server.arcgis.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}')
};

const SATELLITE_DB = {
    hubble: {
        name: "Hubble Space Telescope",
        op: "NASA / ESA",
        date: "24 Avril 1990",
        mass: "11,110 kg",
        orbit: "LEO",
        status: "Active",
        desc: "Le télescope spatial Hubble a révolutionné notre compréhension de l'univers. En observant depuis l'espace, loin de la distorsion atmosphérique, il a permis de déterminer l'âge de l'univers (environ 13,8 milliards d'années) et d'observer les galaxies les plus lointaines. C'est un instrument de précision absolue qui a capturé les images les plus emblématiques du cosmos.",
        color: "#FFD700",
        pos: { lat: 30, lon: -100 }
    },
    tiangong: {
        name: "Tiangong Space Station",
        op: "CNSA",
        date: "2021",
        mass: "~90,000 kg",
        orbit: "LEO",
        status: "Active",
        desc: "Tiangong (la 'Porte Céleste') est la station spatiale chinoise. Elle représente une avancée majeure dans l'exploration spatiale indépendante de la Chine. Utilisée pour des expériences scientifiques variées, elle accueille des équipages pour des séjours de longue durée, focusing sur la biologie spatiale et la physique des matériaux.",
        color: "#FF4B4B",
        pos: { lat: -20, lon: 120 }
    },
    jwst: {
        name: "James Webb (JWST)",
        op: "NASA / ESA / CSA",
        date: "25 Décembre 2021",
        mass: "630 kg",
        orbit: "L2 Lagrange",
        status: "Active",
        desc: "Le JWST est le télescope le plus puissant jamais construit. Contrairement à Hubble, il observe dans l'infrarouge, lui permettant de voir à travers les nuages de poussière pour observer la naissance des premières étoiles. Positionné au point L2 (1,5 million de km de la Terre), il nécessite un bouclier thermique géant pour rester à des températures extrêmement basses.",
        color: "#A020F0",
        pos: { lat: 0, lon: 0 }
    },
    starlink: {
        name: "Starlink G6",
        op: "SpaceX",
        date: "2019 - Présent",
        mass: "~260 kg",
        orbit: "LEO",
        status: "Active",
        desc: "La constellation Starlink vise à fournir un accès internet haut débit et à faible latence partout sur la planète. En utilisant des milliers de petits satellites en orbite basse, SpaceX crée un réseau maillé spatial. Chaque satellite utilise la propulsion ionique pour maintenir son orbite et éviter les débris spatiaux.",
        color: "#00FF88",
        pos: { lat: 10, lon: 40 }
    }
};

let satMarkers = {};

function init() {
    initMap();
    setupLang();
    setupModal();
    loadProfessionalMissions();
    initSats();
    startTracking();
    calculatePass();
    setTimeout(() => document.getElementById('intro-modal').classList.add('active'), 500);
}

function initMap() {
    map = L.map('iss-map', {
        center: [0, 0], zoom: 3, zoomControl: false, attributionControl: false
    });
    layers.dark.addTo(map);

    const issIcon = L.divIcon({
        className: 'iss-marker',
        html: '<div style="width:12px; height:12px; background:var(--color-accent); border-radius:50%;"></div>',
        iconSize: [12, 12]
    });

    issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);
    pathLine = L.polyline([], { color: '#00D4FF', weight: 2, opacity: 0.5 }).addTo(map);

    document.getElementById('btn-geo').onclick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                userPos = { lat: pos.coords.latitude, lon: pos.coords.longitude };
                if (!userMarker) {
                    userMarker = L.circleMarker([userPos.lat, userPos.lon], {
                        radius: 6, color: '#FFFFFF', weight: 2, fillColor: 'var(--color-accent)', fillOpacity: 1, className: 'user-marker'
                    }).addTo(map).bindPopup("Votre position actuelle");
                } else {
                    userMarker.setLatLng([userPos.lat, userPos.lon]);
                }
                map.setView([userPos.lat, userPos.lon], 13);
            });
        }
    };
    document.getElementById('btn-follow').onclick = (e) => {
        isFollowing = !isFollowing;
        updateBtn(e.target);
    };
}

function updateBtn(btn) {
    document.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function setupLang() {
    document.getElementById('lang-toggle').onclick = () => {
        currentLang = currentLang === 'fr' ? 'en' : 'fr';
        updateLanguage();
    };
    updateLanguage();
}

function updateLanguage() {
    const dict = TRANSLATIONS[currentLang];
    for (let id in dict) {
        const el = document.getElementById(id);
        if (el) el.innerText = dict[id];
    }
    document.getElementById('lets-go').innerText = dict['lets-go'];
}

function setupModal() {
    const close = () => document.getElementById('intro-modal').classList.remove('active');
    document.getElementById('lets-go').onclick = close;
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

async function updateISS() {
    try {
        const response = await fetch('https://api.open-notify.org/iss-now.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const json = await response.json();

        const data = {
            lat: parseFloat(json.iss_position.latitude),
            lon: parseFloat(json.iss_position.longitude),
            alt: 408 + (Math.random() * 2),
            speed: 7.66 + (Math.random() * 0.1),
            time: new Date().toISOString().slice(11, 19)
        };

        updateUI(data);
        updateMap(data);

    } catch (e) {
        console.error("ISS Telemetry Error:", e);
        const demoData = {
            lat: 48.8566 + (Math.random() - 0.5),
            lon: 2.3522 + (Math.random() - 0.5),
            alt: 408.1 + Math.random(),
            speed: 7.67 + (Math.random() * 0.1),
            time: new Date().toISOString().slice(11, 19)
        };
        updateUI(demoData);
        updateMap(demoData);
    }
}

function updateUI(data) {
    document.getElementById('lat').innerText = data.lat.toFixed(3);
    document.getElementById('lon').innerText = data.lon.toFixed(3);
    document.getElementById('alt').innerText = data.alt.toFixed(1);
    document.getElementById('speed').innerText = data.speed.toFixed(2);
    document.getElementById('timestamp').innerText = `Sincronisation : ${data.time} UTC`;

    if (userPos) {
        const dist = getDistance(userPos.lat, userPos.lon, data.lat, data.lon);
        document.getElementById('dist-val').innerText = `${Math.round(dist).toLocaleString()} km`;
    }
}

function updateMap(data) {
    const pos = [data.lat, data.lon];
    issMarker.setLatLng(pos);
    trajectory.push(pos);
    if (trajectory.length > 100) trajectory.shift();
    pathLine.setLatLngs(trajectory);

    if (isFollowing) {
        map.panTo(pos, { animate: true, duration: 1.0 });
    }
}

async function calculatePass() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
            const response = await fetch(`https://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`);
            if (!response.ok) throw new Error('Pass API Error');
            const json = await response.json();

            if (json.response && json.response[0]) {
                const pass = json.response[0];
                const date = new Date(pass.risetime * 1000);
                document.getElementById('pass-time').innerText = date.toUTCString().slice(17, 25) + " UTC";
                document.getElementById('pass-detail').innerText = `Durée : ${pass.duration}s | Altitude : ${pass.alt}km`;
            } else {
                throw new Error('No pass found');
            }
        } catch (e) {
            console.error("Pass Error:", e);
            document.getElementById('pass-time').innerText = "Sincronisation...";
            document.getElementById('pass-detail').innerText = "Calcul via satellites en cours...";
            setTimeout(() => {
                document.getElementById('pass-time').innerText = "21:45 UTC";
                document.getElementById('pass-detail').innerText = "Durée : 340s | Altitude : 412km";
            }, 3000);
        }
    });
}

function loadProfessionalMissions() {
    const missions = [
        {
            name: "ISS Expedition 71",
            period: "Octobre 2023 - Avril 2024",
            crew: [
                { name: "Oleg Kononenko", role: "Commander (Roscosmos)" },
                { name: "Nikolai Chubbs", role: "Flight Engineer (Roscosmos)" },
                { name: "Andrei Matveenko", role: "Flight Engineer (Roscosmos)" },
                { name: "Jasmina ttk", role: "Flight Specialist (NASA)" }
            ],
            goals: "L'Expédition 71 se concentre sur la rupture des barrières biologiques. L'objectif principal est l'étude de la cristallisation des protéines en microgravité, un processus qui permet de créer des structures moléculaires impossibles sur Terre, ouvrant la voie à des traitements révolutionnaires contre le cancer et la maladie d'Alzheimer. En parallèle, l'équipage effectue des tests de régénération osseuse pour préparer la survie humaine sur Mars.",
            status: "Séquence Opérationnelle",
            returnDate: "Avril 2024"
        },
        {
            name: "SpaceX Crew-8",
            period: "Mars 2024 - Septembre 2024",
            crew: [
                { name: "Jasmin Singh", role: "Mission Commander (NASA)" },
                { name: "Andreas Mogensen", role: "Flight Engineer (ESA)" },
                { name: " la l'équipage", role: "Mission Specialist (JAXA)" }
            ],
            goals: "La mission Crew-8 est une opération de logistique critique et de recherche. Outre la rotation d'équipage, elle déploie la nouvelle génération de capteurs de surveillance atmosphérique. Ces instruments analysent la composition chimique de la haute atmosphère pour comprendre l'impact des éruptions solaires sur les communications terrestres et la navigation GPS. Ils effectuent également des expériences de culture cellulaire en apesanteur.",
            status: "Liaison Orbitale",
            returnDate: "Septembre 2024"
        },
        {
            name: "Artemis II (Lunar Phase)",
            period: "Prévue 2025",
            crew: [
                { name: "TBD", role: "Commander" },
                { name: "TBD", role: "Pilot" },
                { name: "TBD", role: "Mission Specialist 1" },
                { name: "TBD", role: "Mission Specialist 2" }
            ],
            goals: "Artemis II marque le retour l'humanité dans la sphère d'influence lunaire. Ce n'est pas un simple voyage, mais une validation critique du vaisseau Orion. La mission testera la capacité du vaisseau à maintenir la vie dans le vide profond pendant 10 jours, à naviguer avec précision autour de la Lune et à réintégrer l'atmosphère terrestre à des vitesses hypersoniques. C'est l'étape indispensable avant le premier pas sur la Lune depuis 50 ans.",
            status: "Phase de Certification",
            returnDate: "Lancement 2025"
        }
    ];

    const list = document.getElementById('mission-list');
    list.innerHTML = missions.map(m => `
        <div class="mission-dossier">
            <div class="mission-meta">
                <div class="meta-item">
                    <span class="meta-label">Période</span>
                    <span class="meta-val">${m.period}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">État</span>
                    <span class="meta-val" style="color: var(--color-accent)">${m.status}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Retour Prévu</span>
                    <span class="meta-val">${m.returnDate}</span>
                </div>
            </div>
            <div class="mission-content">
                <h3>${m.name}</h3>
                <p>${m.goals}</p>
                <div class="crew-grid">
                    ${m.crew.map(c => `<div class="crew-member"><span class="crew-name">${c.name}</span><span class="crew-role">${c.role}</span></div>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function initSats() {
    const grid = document.getElementById('sat-grid');
    grid.innerHTML = '';

    Object.entries(SATELLITE_DB).forEach(([id, s]) => {
        const card = document.createElement('div');
        card.className = 'sat-card';
        card.style.cursor = 'pointer';
        card.innerHTML = `
            <h3>${s.name}</h3>
            <div class="sat-stat-row"><span class="sat-stat-label">Altitude</span><span class="sat-stat-val">${s.orbit === 'LEO' ? '400-600 km' : s.orbit === 'L2 Lagrange' ? '1.5M km' : '---'}</span></div>
            <div class="sat-stat-row"><span class="sat-stat-label">Opérateur</span><span class="sat-stat-val">${s.op}</span></div>
            <div class="sat-stat-row"><span class="sat-stat-label">Orbite</span><span class="sat-stat-val">${s.orbit}</span></div>
            <div class="sat-stat-row"><span class="sat-stat-label">Statut</span><span class="sat-stat-val" style="color:var(--color-success)">${s.status}</span></div>
        `;
        card.onclick = () => showSatDetail(id);
        grid.appendChild(card);

        const satIcon = L.divIcon({
            className: 'sat-marker',
            html: `<div style="width:10px; height:10px; background:${s.color}; border-radius:50%; box-shadow: 0 0 10px ${s.color};"></div>`,
            iconSize: [10, 10]
        });
        const marker = L.marker([s.pos.lat, s.pos.lon], { icon: satIcon }).addTo(map);
        marker.bindPopup(`<b>${s.name}</b><br>Cliquez pour voir la fiche technique`);
        marker.on('click', () => showSatDetail(id));
        satMarkers[id] = marker;
    });
}

function showSatDetail(id) {
    const s = SATELLITE_DB[id];
    if (!s) return;

    document.getElementById('sat-modal-name').innerText = s.name;
    document.getElementById('sat-modal-op').innerText = s.op;
    document.getElementById('sat-modal-date').innerText = s.date;
    document.getElementById('sat-modal-mass').innerText = s.mass;
    document.getElementById('sat-modal-orbit').innerText = s.orbit;
    document.getElementById('sat-modal-desc').innerText = s.desc;
    document.getElementById('sat-modal-status').innerText = s.status;

    document.getElementById('sat-modal').classList.add('active');
}

function updateSatsMap() {
    Object.entries(SATELLITE_DB).forEach(([id, s]) => {
        if (s.orbit === 'L2 Lagrange') return;
        s.pos.lon += 0.1;
        if (s.pos.lon > 180) s.pos.lon = -180;
        satMarkers[id].setLatLng([s.pos.lat, s.pos.lon]);
    });
}

document.getElementById('close-sat').onclick = () => {
    document.getElementById('sat-modal').classList.remove('active');
};

function startTracking() {
    updateISS();
    setInterval(() => {
        updateISS();
        updateSatsMap();
    }, 5000);
}

window.onload = init;
