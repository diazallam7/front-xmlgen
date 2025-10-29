import React from 'react'
import { InvoiceForm } from './components/InvoiceForm'

export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>XMLGen - Generar Factura (Demo)</h1>
      <p>Pege o cargue el JSON de la factura y presione <strong>Enviar</strong>.</p>
      <InvoiceForm />
    </div>
  )
}
