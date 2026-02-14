import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import type { PatchSheetDoc } from '@/types/patch-sheet';
import type { RunOfShowDoc } from '@/types/run-of-show';

export function exportPatchSheetPdf(doc: PatchSheetDoc, name: string): void {
  const pdf = new jsPDF('landscape', 'mm', 'a4');

  pdf.setFontSize(16);
  pdf.text(name, 14, 15);

  pdf.setFontSize(9);
  const meta = doc.metadata;
  const metaLines = [
    meta.venue && `Venue: ${meta.venue}`,
    meta.date && `Date: ${meta.date}`,
    meta.fohEngineer && `FOH: ${meta.fohEngineer}`,
    meta.monitorEngineer && `Monitor: ${meta.monitorEngineer}`,
  ].filter(Boolean);
  if (metaLines.length) {
    pdf.text(metaLines.join('  |  '), 14, 22);
  }

  if (doc.inputs.length > 0) {
    pdf.setFontSize(11);
    pdf.text('Inputs', 14, 32);
    autoTable(pdf, {
      startY: 35,
      head: [['#', 'Name', 'Mic Type', 'Device', '48V', 'Connection', 'Details', 'Notes']],
      body: doc.inputs.map(ch => [
        ch.channelNumber,
        ch.name,
        ch.micType,
        ch.device,
        ch.phantom ? 'Y' : '',
        ch.connection,
        ch.connectionDetails,
        ch.notes,
      ]),
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [59, 130, 246] },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (pdf as any).lastAutoTable?.finalY ?? 35;

  if (doc.outputs.length > 0) {
    const outputStartY = doc.inputs.length > 0 ? finalY + 10 : 32;
    if (outputStartY > 170) pdf.addPage();
    const y = outputStartY > 170 ? 15 : outputStartY;
    pdf.setFontSize(11);
    pdf.text('Outputs', 14, y);
    autoTable(pdf, {
      startY: y + 3,
      head: [['#', 'Name', 'Source Type', 'Source', 'Dest Type', 'Dest Gear', 'Notes']],
      body: doc.outputs.map(ch => [
        ch.channelNumber,
        ch.name,
        ch.sourceType,
        ch.sourceDetails,
        ch.destinationType,
        ch.destinationGear,
        ch.notes,
      ]),
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [59, 130, 246] },
    });
  }

  pdf.save(`${name}.pdf`);
}

export async function exportStagePlotPdf(canvasElement: HTMLElement, name: string): Promise<void> {
  const canvas = await html2canvas(canvasElement, {
    backgroundColor: null,
    scale: 2,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  const isLandscape = imgWidth >= imgHeight;
  const pdf = new jsPDF(isLandscape ? 'landscape' : 'portrait', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.setFontSize(16);
  pdf.text(name, 14, 15);

  const maxWidth = pageWidth - 28;
  const maxHeight = pageHeight - 30;
  const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
  const drawWidth = imgWidth * ratio;
  const drawHeight = imgHeight * ratio;
  const x = (pageWidth - drawWidth) / 2;

  pdf.addImage(imgData, 'PNG', x, 22, drawWidth, drawHeight);
  pdf.save(`${name}.pdf`);
}

export function exportRunOfShowPdf(doc: RunOfShowDoc, name: string): void {
  const pdf = new jsPDF('landscape', 'mm', 'a4');

  pdf.setFontSize(16);
  pdf.text(name, 14, 15);

  const customCols = doc.customColumns.map(c => c.name);
  const head = ['#', 'Start', 'Duration', 'Audio', 'Video', 'Lights', 'Notes', ...customCols];

  const body = doc.items.map(item => {
    if (item.type === 'header') {
      return [{ content: item.headerTitle, colSpan: head.length, styles: { fontStyle: 'bold' as const, fillColor: [40, 44, 52] as [number, number, number] } }];
    }
    return [
      item.itemNumber,
      item.startTime,
      item.duration,
      item.audio,
      item.video,
      item.lights,
      item.productionNotes,
      ...doc.customColumns.map(c => item.customFields[c.id] ?? ''),
    ];
  });

  autoTable(pdf, {
    startY: 22,
    head: [head],
    body,
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [245, 158, 11] },
  });

  pdf.save(`${name}.pdf`);
}
