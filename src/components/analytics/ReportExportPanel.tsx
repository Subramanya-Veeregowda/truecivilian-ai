import React, { useState } from "react";
import { Download, FileSpreadsheet, FileJson, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import api from "../../lib/api";

interface ReportExportPanelProps {
  onExportSuccess?: (message: string) => void;
  onExportError?: (error: string) => void;
}

export const ReportExportPanel: React.FC<ReportExportPanelProps> = ({ onExportSuccess, onExportError }) => {
  const [selectedFormat, setSelectedFormat] = useState<"csv" | "excel" | "pdf">("csv");
  const [exporting, setExporting] = useState(false);

  const formats = [
    {
      id: "csv",
      title: "Comma Separated Values (.csv)",
      desc: "Raw database list suitable for database import and analysis.",
      icon: FileSpreadsheet,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      id: "excel",
      title: "Microsoft Excel Workbook (.xls)",
      desc: "Formatted sheet containing cell bounds, ideal for spreadsheets.",
      icon: FileSpreadsheet,
      color: "text-teal-500",
      bg: "bg-teal-500/10"
    },
    {
      id: "pdf",
      title: "Executive PDF Summary (.pdf)",
      desc: "ASCII-formatted audit report listing core SLA key performance indexes.",
      icon: FileText,
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    }
  ];

  const handleDownload = async () => {
    setExporting(true);
    try {
      const response = await api.get("/analytics/export", {
        params: { format: selectedFormat },
        responseType: "blob"
      });

      // Get filename from header or use default
      let filename = `truecivilian_report_${new Date().toISOString().split("T")[0]}`;
      if (selectedFormat === "excel") filename += ".xls";
      else if (selectedFormat === "pdf") filename += ".pdf";
      else filename += ".csv";

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      onExportSuccess?.(`Successfully exported ${selectedFormat.toUpperCase()} report!`);
    } catch (err: any) {
      console.error("Export failed", err);
      onExportError?.("Failed to generate and download report. Verify permissions.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card variant="default" className="flex flex-col" id="card-report-export">
      <CardHeader className="py-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <Download className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Operational Exports & Auditing</h3>
            <p className="text-xs text-zinc-400">Generate and download standard municipal analytical datasets</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="flex-grow p-5 flex flex-col justify-between gap-5">
        <div className="space-y-3">
          {formats.map((f) => {
            const IconComponent = f.icon;
            const isSelected = selectedFormat === f.id;
            return (
              <div
                key={f.id}
                id={`export-format-${f.id}`}
                onClick={() => setSelectedFormat(f.id as any)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? "bg-emerald-50/55 border-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/40"
                    : "bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-150 dark:border-zinc-800/60 hover:border-zinc-250 dark:hover:border-zinc-750"
                }`}
              >
                <div className={`p-2.5 rounded-xl ${f.bg} ${f.color} shrink-0`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{f.title}</p>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-normal">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          id="btn-trigger-download"
          variant="primary"
          onClick={handleDownload}
          isLoading={exporting}
          icon={Download}
          fullWidth
        >
          {exporting ? "Generating Report..." : `Export ${selectedFormat.toUpperCase()} Document`}
        </Button>
      </CardBody>
    </Card>
  );
};
