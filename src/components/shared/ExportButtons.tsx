import { FileDown, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExportButtonsProps {
  onPDF: () => void;
  onXLSX: () => void;
}

export function ExportButtons({ onPDF, onXLSX }: ExportButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onPDF}>
        <FileDown className="mr-1.5 h-4 w-4" />
        PDF
      </Button>
      <Button variant="outline" size="sm" onClick={onXLSX}>
        <FileSpreadsheet className="mr-1.5 h-4 w-4" />
        XLSX
      </Button>
    </div>
  );
}
