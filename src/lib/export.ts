import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export function formatFCFA(amount: number): string {
  return amount.toLocaleString('fr-FR') + ' FCFA';
}

interface ExportOptions {
  title: string;
  headers: string[];
  rows: string[][];
  filename: string;
}

export function exportToPDF({ title, headers, rows, filename }: ExportOptions) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('AchScholar', 14, 15);
  doc.setFontSize(10);
  doc.text(`${title} — ${new Date().toLocaleDateString('fr-FR')}`, 14, 22);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 28,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [37, 63, 107] },
  });

  doc.save(`${filename}.pdf`);
}

export function exportToXLSX({ title, headers, rows, filename }: ExportOptions) {
  const wsData = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title);
  XLSX.writeFile(wb, `${filename}.xlsx`);
}
