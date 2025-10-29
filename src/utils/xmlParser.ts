// Utilidades para parsear y formatear el XML retornado por xmlgen-service
export type XmlSummary = {
  rucEmisor?: string;
  razonSocialEmisor?: string;
  numero?: string;
  fechaEmision?: string;
  total?: string;
  totalIVA?: string;
  items?: Array<{ descripcion?: string; cantidad?: string; precio?: string }>;
};

export function formatXml(xml: string) {
  // simple pretty print for XML
  const PADDING = '  ';
  const reg = /(>)(<)(\/*)/g;
  let formatted = '';
  let pad = 0;

  xml = xml.replace(reg, '$1\n$2$3');
  xml.split('\n').forEach((node) => {
    let indent = 0;
    if (node.match(/<.+?>/) && node.match(/<\/.+?>/)) {
      indent = 0;
    } else if (node.match(/<\/.+?>/)) {
      if (pad !== 0) pad -= 1;
    } else if (node.match(/<[^!?].*?>/)) {
      indent = 1;
    }

    formatted += PADDING.repeat(pad) + node + '\n';
    pad += indent;
  });
  return formatted.trim();
}

function getText(doc: Document, tag: string) {
  const el = doc.getElementsByTagName(tag)[0];
  return el ? el.textContent || undefined : undefined;
}

export function parseXmlSummary(xml: string): XmlSummary {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');

    // check for parsererror
    if (doc.getElementsByTagName('parsererror').length) {
      return { };
    }

    const summary: XmlSummary = {};
    // Emisor
    summary.rucEmisor = getText(doc, 'dRucEm') || getText(doc, 'dRuc');
    summary.razonSocialEmisor = getText(doc, 'dNomEmi') || getText(doc, 'dNomEm');
    // Documento
    summary.numero = getText(doc, 'dNumDoc') || getText(doc, 'dNumTim');
    summary.fechaEmision = getText(doc, 'dFeEmiDE') || getText(doc, 'dFecFirma');
    // Totales
    summary.total = getText(doc, 'dTotGralOpe') || getText(doc, 'dTotOpe');
    summary.totalIVA = getText(doc, 'dTotIVA') || getText(doc, 'dIVA5') || getText(doc, 'dLiqTotIVA5');

    // Items: buscar nodos gCamItem o gCamItem > ...
    const items: Array<{ descripcion?: string; cantidad?: string; precio?: string }> = [];
    const itemNodes = doc.getElementsByTagName('gCamItem');
    for (let i = 0; i < itemNodes.length; i++) {
      const inode = itemNodes[i] as Element;
      const descripcion = inode.getElementsByTagName('dDesProSer')[0]?.textContent ||
        inode.getElementsByTagName('dDesProSer')[0]?.textContent;
      const cantidad = inode.getElementsByTagName('dCantProSer')[0]?.textContent;
      const precio = inode.getElementsByTagName('dPUniProSer')[0]?.textContent;
      items.push({ descripcion, cantidad, precio });
    }
    if (items.length) summary.items = items;

    return summary;
  } catch (err) {
    return {};
  }
}
