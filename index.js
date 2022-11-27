const express = require('express')
const app = express()
const port = 8000
const unzip = require('unzip-stream')


app.get('/tp2', (req, res) => {
    const csv = require('csv-parser')
    const fs = require('fs')
    const liste = [];
    const download = require('download');

    download('https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip', 'data').then(() => {
        fs.createReadStream('./data/StockEtablissementLiensSuccession_utf8.zip')
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
            const fileName = entry.path;
            const type = entry.type;
            const size = entry.size;
            if (fileName === "StockEtablissementLiensSuccession_utf8.csv") {
                entry.pipe(csv())
                .on('data', (data) => liste.push(data))
                .on('end', () => {
                    const Siege = liste.filter(result => result.transfertSiege == 'true')
                    const percentage = Siege.length / liste.length * 100
                    let Final = percentage.toFixed(2)
                    res.send(`${Final}% des compagnies ont transféré leur siège social avant le 1er Novembre 2022`)
                } )
            } else {
                entry.autodrain();
            }
        });
})
})

app.listen(port, () => console.log(`Mon TP est sur localhost:${port}/tp2`))