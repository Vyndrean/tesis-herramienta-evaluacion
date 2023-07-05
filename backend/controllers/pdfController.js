const puppeteer = require('puppeteer');

const generatePDF = async (req, res) => {
    try {
        const { html } = req.body

        const browser = await puppeteer.launch({ headless: 'new' })
        const page = await browser.newPage()
        // Cargar la pagina
        await page.setContent(html)

        // Genera el PDF y asinga en formato
        const pdf = await page.pdf({ format: 'A4' })

        await browser.close()

        res.status(200).json({ pdf: pdf.toString('base64') })
    } catch (error) {
        console.error('Error al generar el PDF:', error)
        res.status(500).json({ message: 'Error al generar el PDF' })
    }
}

module.exports = {
    generatePDF
}