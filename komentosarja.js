// Pohjarunko Mika


// Pakotetaan muuttujan (variable) esittely tapahtuvaksi (var x = arvo;)
"use strict";

// KATJA: Globaali muuttuja, joka jaetaan eri metodeille hyödynnettäväksi
// (avain-arvo -parit pysäkkilyhenteille)
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


// Haetaan HTML-dokumentista haluttu elementti käsiteltäväksi
var htmlElementti = document.getElementById("lista");

// Luodaan XMLHttpRequest olio
var kyselija = new XMLHttpRequest();

// Alustetaan yhteys "true" -arvolla asynkroniseksi
kyselija.open("GET", "https://rata.digitraffic.fi/api/v1/live-trains/station/HKI/", true);
// Avataan yhteys
kyselija.send();

// KALLE: Rajoitetaan silmukalla etusivulla näytettäviä H:ki pysäkiltä seuraavaksi lähteviä junia
var rajoitin = 0;

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

            for (var i = 0; i < taulu.length; i++) {
                var junaTaulukkona = taulu[i];
                var lahtoaika = new Date(junaTaulukkona.timeTableRows[0].scheduledTime);
                var stilisointi = {hour: "2-digit", minute: "2-digit", hour12: false};
                var taulukonKoko = junaTaulukkona.timeTableRows.length;
                var saapumisaika = new Date();  // Esitellään ennen seuraavaa silmukaa muuttuja, silmukan ulkopuolella
                var paateasema = junaTaulukkona.timeTableRows[junaTaulukkona.timeTableRows.length - 1].stationShortCode;

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


                // KALLE: Haetaan seuraavaksi lähteviä junia poispäin Helsingistä, määränpäästä riippumatta ("Pako Helsingistä")
                var lahtevat = junaTaulukkona.timeTableRows[0].stationShortCode;
                if (lahtevat == "HKI" && rajoitin < 3) {
                    rajoitin++;

                    // KATJA: "Äkkilähdöissä" (pako Helsingistä) näytetään lyhenne mikäli
                    // HTML puolella ei ole määritelty selkonimeä
                    var endstation = lyhenteet[paateasema];
                    if (endstation === undefined)   {
                        endstation = paateasema;
                    }

// Luodaan elementtipuun rakenteeseen uusi tekstisolmu ja haetaan
// siihen sisältökirjoitusta
                    var solmu = document.createTextNode(junaTaulukkona.trainType + junaTaulukkona.trainNumber +
                        ' Helsingistä lähtee klo. ' + lahtoaika.toLocaleTimeString("fi", stilisointi) + " suuntana  " + endstation);

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
            }


        } else {
            alert("Pyyntö epäonnistui");
        }
    }
}


// *************************************************************************************************************************

// MIKA: Globaaleja muuttujia, jotka jaetaan eri metodeille hyödynnettäväksi
// (muokataan URL osoitetta mistä REST APIsta tarvittava tieto noudetaan)
                                        var osoite;
                                        // Lähtöasema
                                        var lahtoAsemaLyhytTunniste;
                                        // Päätepysäkki
                                        var paatePysakkiLyhytTunniste;


                                        // MIKA: Muokattu Katjan scriptiä siten, että sen voi sijoittaa erilliseen tiedostoon ja lisätty metodin suoritus
                                        function asetaPysakki() {
    // KALLE: Poistaa käyttäjälle näytettävältä sivulta mahdollisesti aiemmin haetut tiedot (eli hakutulosta ei lisätä vanhan hakutuloksen jatkeeksi)
    var hakutulos = document.getElementById("hakutulos");
    while (hakutulos.firstChild){
        hakutulos.removeChild(hakutulos.firstChild);
    }
    //Lisättiin kalenterin antama pv urlin perään @Kalle
    osoite = "https://rata.digitraffic.fi/api/v1/live-trains/station/" + document.getElementById('lahtoasemat').value + "/" + document.getElementById("asemat").value + "?departure_date=" + document.getElementById("meeting").value;
    console.log(osoite);
    // Lähtöasema
    lahtoAsemaLyhytTunniste = document.getElementById('lahtoasemat').value;

    // KATJA: Tallennetaan APIsta saatu tulos SessionStorageen, jota voi uudelleen käyttää eri sivuilla
    sessionStorage.lahtoasema = lahtoAsemaLyhytTunniste;

    // Päätepysäkki
    paatePysakkiLyhytTunniste = document.getElementById("asemat").value;

    sessionStorage.paatepysakki=paatePysakkiLyhytTunniste;

    haeJuna();
}


function haeJuna() {
// Haetaan HTML-dokumentista haluttu elementti käsiteltäväksi
    var htmlElementti = document.getElementById("hakutulos");

// Luodaan XMLHttpRequest olio
    var kyselija = new XMLHttpRequest();

// Alustetaan yhteys "true" -arvolla asynkroniseksi
    kyselija.open("GET", osoite, true);
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

                // KATJA: Avataan uusi HTML-sivu ja hyödynnetään SessionStorageen tallennettua tietoa (APIsta saatu tulos)
                sessionStorage.taulu = sisalto;
                window.location="hakutehty.html";

                // i < taulu.length
                for (var i = 0; i < 3; i++) {
                    var junaTaulukkona = taulu[i];

                    // KALLE: Try-catch sille, että käyttäjä on asettanut junaraiteiden päiksi pysäkit, joille VR ei tarjoa suoraa yhteyttä
                    try {
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

// Luodaan elementtipuun rakenteeseen uusi tekstisolmu ja haetaan
// siihen sisältökirjoitusta
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

                    } catch (err){
                        alert("Annettujen asemien välille ei löytynyt suoraa yhteyttä");
                        break;
                    }

// HTML-sivun muokkaus olisi voitu tehdä myös suoraan, maatuskanuken tavoin, asettamalla lauseet sisäkkäin:
// htmlElementti.appendChild(document.createElement("li").appendChild(document.createTextNode(junaTaulukkona.trainCategory + ' juna: "' + junaTaulukkona.trainType + junaTaulukkona.trainNumber + '" (Helsingistä) lähtee klo. ' + lahtoaika.toLocaleTimeString("fi", stilisointi) + " ja saapuu Lappeenrantaan klo. " + saapumisaika.toLocaleTimeString("fi", stilisointi))));
                }
            } else {
                alert("Pyyntö epäonnistui");
            }
        }
    }
}