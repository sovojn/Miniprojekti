console.log(sessionStorage.taulu);
var taulu = JSON.parse(sessionStorage.taulu);
console.dir(taulu);
var htmlElementti = document.getElementById("hakutulos");
var paatePysakkiLyhytTunniste = sessionStorage.paatepysakki;
var lahtoAsemaLyhytTunniste = sessionStorage.lahtoasema;

var lyhenteet = {
    'HPK': 'Haapamäki', 'HNK': 'Hanko', 'HKI': 'Helsinki', 'HL': 'Hämeenlinna', 'ILM': 'Iisalmi',
    'IMR': 'Imatra', 'JNS': 'Joensuu', 'JY': 'Jyväskylä', 'KAJ': 'Kajaani', 'KR': 'Karjaa',
    'KEM': 'Kemi', 'KJÄ': 'Kemijärvi', 'KOK': 'Kokkola', 'KLI': 'Kolari', 'KON': 'Kontiomäki',
    'KTA': 'Kotka', 'KV': 'Kouvola', 'KUO': 'Kuopio', 'LH': 'Lahti', 'LR': 'Lappeenranta',
    'MI': 'Mikkeli', 'NRM': 'Nurmes', 'OV': 'Orivesi', 'OL': 'Oulu', 'PAR': 'Parikkala',
    'PKO': 'Parkano', 'PM': 'Pieksamäki', 'PRI': 'Pori', 'PNÄ': 'Pännäinen', 'RI': 'Riihimäki',
    'ROI': 'Rovaniemi', 'SL': 'Savonlinna', 'SK': 'Seinäjoki', 'TPE': 'Tampere', 'TKL': 'Tikkurila',
    'TL': 'Toijala', 'TOR': 'Tornio', 'TKU': 'Turku', 'VS': 'Vaasa', 'VNA': 'Vainikkala',
    'YV': 'Ylivieska'
}

for (var i = 0; i < 3; i++) {
    var junaTaulukkona = taulu[i];

    var lahtoaika = new Date(junaTaulukkona.timeTableRows[0].scheduledTime);
    var stilisointi = {hour: "2-digit", minute: "2-digit", hour12: false};
    var taulukonKoko = junaTaulukkona.timeTableRows.length;
    var saapumisaika = new Date();  // Esitellään ennen seuraavaa silmukaa muuttuja, silmukan ulkopuolella
    var paateasema = junaTaulukkona.timeTableRows[junaTaulukkona.timeTableRows.length - 1].stationShortCode;

    for (var j = 0; j < junaTaulukkona.timeTableRows.length; j++) {

        if (junaTaulukkona.timeTableRows[j].stationShortCode === paatePysakkiLyhytTunniste) {
            saapumisaika = new Date(junaTaulukkona.timeTableRows[j].scheduledTime);
            // Pysäytetään silmukka ensimmäisellä kerralla ehtolauseeseen astuttaessa,
            // koska seuraava saman pysäkin kellonaika on junan matkan jatkumisen aika
            // eli lähtöaika samalta asemalta
            break;
        }
    }

    var solmu = document.createTextNode(junaTaulukkona.trainType + junaTaulukkona.trainNumber +
        " Asemalta " + lyhenteet[lahtoAsemaLyhytTunniste] + " lähtee klo. " + lahtoaika.toLocaleTimeString("fi", stilisointi) +
        // " suuntana  " + paateasema +
        " ja saapuu kohteeseen " +
        lyhenteet[paatePysakkiLyhytTunniste] +
        " klo. " + saapumisaika.toLocaleTimeString("fi", stilisointi));

// Jokaisella silmukoinnilla tehdään uusi kohta järjestämättömään listaan
    var uusielementti = document.createElement("li");
// Jokaiseen listaelementin uuteen kohtaan sijoitetaan tekstisolmu,
// jossa on kirjoitusta taulukon sisällöstä
    uusielementti.appendChild(solmu);

// Käsiteltävään HTML-elementtiin lisätään uusi
// osio listaelementin kohta, jossa on taulukosta
// haettu sisältö kapseloituna sisälleen tekstiNodeen,
// ikään kuin maatuskanuken tavoin...
    htmlElementti.appendChild(uusielementti);
}
