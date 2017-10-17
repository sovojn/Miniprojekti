// Pakotetaan muuttujan (variable) esittely tapahtuvaksi (var x = arvo;)
"use strict";

// JSON PARSINTA LIIKENNEVIRASTOSTA ALKAA
// Haetaan HTML-dokumentista haluttu elementti käsiteltäväksi
var htmlElementti = document.getElementById("lista");

// Luodaan XMLHttpRequest olio
var kyselija = new XMLHttpRequest();

// Alustetaan yhteys "true" -arvolla asynkroniseksi
kyselija.open("GET", "https://rata.digitraffic.fi/api/v1/live-trains/station/HKI?minutes_before_departure=15&minutes_after_departure=15", true);
// Avataan yhteys
kyselija.send();

// Luodaan avoimelle yhteydelle (oliolle) tapahtumankäsittelijä,
// joka (tilanmuutosten yhteydessä) toteuttaa kommunikointia metodilla
kyselija.onreadystatechange = function () {
    if (kyselija.readyState === 4) {
        if (kyselija.status === 200 || kyselija.status === 204) {

            // Mikäli tähän Jos-lauseeseen on astuttu, niin pyyntö on valmis
            // console.log(kyselija.responseText);

            // Tallennetaan saatu vastausteksti erilliseen muuttujaan
            // ihan vaan selkeyden vuoksi ja siis esimerkin omaisesti
            var sisalto = kyselija.responseText;

            // Muunnetaan saatu merkkijono (String) taulukoksi, jäsentelemällä (parse)
            // sen aaltosulkeissa olevat osuudet dynaamisesti kasvatettavan taulukon eri alkioiksi
            var taulu = JSON.parse(sisalto);
            //console.log(taulu[0].stationName);
            // Selaimen kehittäjätyökalun konsolilla huomataan hakemistosta (dir)
            // kyseessä olevan Javan kaltainen HashMap-taulukko (JavaScriptin assosiatiivinen
            // avain-arvo -pari taulukko). Konsolilta nähdään mitä avaimia eri arvoille on tarjolla
            console.dir(taulu);

            // i < taulu.length
            for (var i = 0 ; i < 3 ; i++){
                var junaTaulukkona = taulu[i];

                var lahtoaika = new Date(junaTaulukkona.timeTableRows[0].scheduledTime);
                var stilisointi = {hour: "2-digit", minute: "2-digit", hour12: false};
                var taulukonKoko = junaTaulukkona.timeTableRows.length;
                var saapumisaika = new Date();  // Esitellään ennen seuraavaa silmukaa muuttuja, silmukan ulkopuolella
                var jep = junaTaulukkona.timeTableRows[junaTaulukkona.timeTableRows.length -1].stationShortCode;

                // for (var j = 0 ; j < junaTaulukkona.timeTableRows.length ; j++){
                //
                //     if (junaTaulukkona.timeTableRows[j].stationShortCode === "LR"){
                //         saapumisaika = new Date(junaTaulukkona.timeTableRows[j].scheduledTime);
                //         // Pysäytetään silmukka ensimmäisellä kerralla ehtolauseeseen astuttaessa,
                //         // koska seuraava saman pysäkin kellonaika on junan matkan jatkumisen aika
                //         // eli lähtöaika samalta asemalta
                //         break;
                //     }
                // }

// Luodaan elementtipuun rakenteeseen uusi tekstisolmu ja haetaan
// siihen sisältökirjoitusta
                var solmu = document.createTextNode(junaTaulukkona.trainType + junaTaulukkona.trainNumber +
                    ' Helsingistä lähtee klo. ' + lahtoaika.toLocaleTimeString("fi", stilisointi) + " suuntana  " + jep);

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

// HTML-sivun muokkaus olisi voitu tehdä myös suoraan, maatuskanuken tavoin, asettamalla lauseet sisäkkäin:
// htmlElementti.appendChild(document.createElement("li").appendChild(document.createTextNode(junaTaulukkona.trainCategory + ' juna: "' + junaTaulukkona.trainType + junaTaulukkona.trainNumber + '" (Helsingistä) lähtee klo. ' + lahtoaika.toLocaleTimeString("fi", stilisointi) + " ja saapuu Lappeenrantaan klo. " + saapumisaika.toLocaleTimeString("fi", stilisointi))));
            }
        } else {
            alert("Pyyntö epäonnistui");
        }
    }
}
// JSON PARSINTA LIIKENNEVIRASTOSTA LOPPUU

