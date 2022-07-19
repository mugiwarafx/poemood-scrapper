const fs = require('fs')
const axios = require('axios')
const cheerio = require('cheerio')
const { each } = require('cheerio/lib/api/traversing')
//const pretty = require("pretty");

const url =
  'https://cultura.gencat.cat/ca/ilc/que-fem/publicacions/postals-literaries/'

async function scrapeData() {
  try {
    const { data } = await axios.get(url)

    const $ = cheerio.load(data)

    const tableRows = $('#demo > tbody > tr')
    const tableCols = $('#demo > thead > tr > th')

    const postals = []
    const postalProps = []

    tableCols.each((i, col) => {
      postalProps.push(
        $(col)
          .text()
          .toLowerCase()
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
      )
    })

    tableRows.each((i, row) => {
      const postal = {}
      const td = $(row).find('td')
      $(td).each((i, el) => {
        postal[postalProps[i]] = $(el).text()
      })
      postals.push(postal)
    })

    console.log(postals)
    fs.writeFile('postals.json', JSON.stringify(postals), (err) => {
      if (err) {
        console.error(err)
        return
      }
      console.log('Successfully written data to file')
    })
  } catch (err) {
    console.error(err)
  }
}

scrapeData()
