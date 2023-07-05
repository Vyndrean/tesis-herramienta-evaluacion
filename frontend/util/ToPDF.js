import CustomButton from "@/styles/customButton";
import axios from "axios";
import React from 'react'

const ToPDF = () => {

    const generatePDF = async () => {
        try {
            const response = await axios.post(`${process.env.SERVIDOR}/generate-pdf`, {
                html: document.documentElement.innerHTML
            })

            const downloadLink = document.createElement('a')
            downloadLink.href = `data:application/pdf;base64,${response.data.pdf}`
            downloadLink.download = 'pagina.pdf'
            downloadLink.click()
        } catch (error) {
            console.error('Error al generar el PDF:', error)
        }
    }

    return (
        <CustomButton onClick={generatePDF} hidden>TEST</CustomButton>
    )
}

export default ToPDF