import axios from 'axios';

const XMLGEN_URL = (import.meta.env.VITE_XMLGEN_URL as string) || 'http://localhost:4000/generate-invoice';
const TIMEOUT = 60000; // 60s

export async function generateInvoiceDirect(payload: any) {
  const res = await axios.post(XMLGEN_URL, payload, { timeout: TIMEOUT, headers: { 'Content-Type': 'application/json' } });
  return res.data;
}

export async function generateInvoiceViaBackend(payload: any) {
  const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:8000';
  const url = `${API_BASE}/api/invoices`;
  const res = await axios.post(url, payload, { timeout: TIMEOUT });
  return res.data;
}
