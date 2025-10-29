import React, { useState } from 'react';
import { generateInvoiceDirect, generateInvoiceViaBackend } from '../api/xmlgen';
import samplePayload from '../sample/sample-payload.json';
import { formatXml, parseXmlSummary, type XmlSummary } from '../utils/xmlParser';

export const InvoiceForm: React.FC = () => {
  const [text, setText] = useState<string>(JSON.stringify(samplePayload, null, 2));
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [xmlPretty, setXmlPretty] = useState<string | null>(null);
  const [xmlSummary, setXmlSummary] = useState<XmlSummary | null>(null);
  const [useBackend, setUseBackend] = useState(false);

  const handleSend = async () => {
    setResponseText(null);
    let payload: any;
    try {
      payload = JSON.parse(text);
    } catch (err: any) {
      setResponseText('JSON inválido: ' + err.message);
      return;
    }

    setLoading(true);
    try {
      const res = useBackend ? await generateInvoiceViaBackend(payload) : await generateInvoiceDirect(payload);
      setResponseText(JSON.stringify(res, null, 2));
      if (res && res.success && res.xml) {
        // Parse and format XML for a readable UI
        try {
          const pretty = formatXml(res.xml);
          setXmlPretty(pretty);
          const summary = parseXmlSummary(res.xml);
          setXmlSummary(summary);
        } catch (parseErr) {
          setXmlPretty(res.xml);
          setXmlSummary(null);
        }

        // keep download (optional) but don't force it if user prefers to inspect
        const blob = new Blob([res.xml], { type: 'application/xml' });
        const href = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = href;
        a.download = `factura_${Date.now()}.xml`;
        a.click();
        URL.revokeObjectURL(href);
      } else {
        setXmlPretty(null);
        setXmlSummary(null);
      }
    } catch (err: any) {
      setResponseText('Error de red o servidor: ' + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = () => setText(JSON.stringify(samplePayload, null, 2));

  return (
    <div className="container">
      <div style={{ marginBottom: 8 }}>
        <label style={{ marginRight: 8 }}>
          <input type="checkbox" checked={useBackend} onChange={(e) => setUseBackend(e.target.checked)} />
          Enviar vía backend (/api/invoices)
        </label>
        <button onClick={handleLoadSample} style={{ marginLeft: 8 }}>Cargar sample</button>
      </div>

      <textarea value={text} onChange={(e) => setText(e.target.value)} />

      <div style={{ marginTop: 8 }}>
        <button onClick={handleSend} disabled={loading} style={{ padding: '8px 12px' }}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>Respuesta</h3>
        <pre style={{ background: '#111', color: '#bde', padding: 12 }}>{responseText}</pre>
      </div>
    </div>
  );
};
