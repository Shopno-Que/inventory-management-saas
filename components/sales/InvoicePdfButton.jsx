"use client";

import { jsPDF } from "jspdf";
import { FiPrinter } from "react-icons/fi";

function formatMoney(value, currencyCode) {
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode || "USD",
    }).format(Number(value || 0));
}

export default function InvoicePdfButton({
    store,
    sale,
    customerName,
    slug,
    variant,
}) {
    const isIcon = variant === "icon";
    const handleDownload = () => {
        const pdf = new jsPDF({
            unit: "pt",
            format: "a4",
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 40;
        const currency = store.currencyCode || "USD";

        let y = 48;

        // Header
        pdf.setFontSize(22);
        pdf.setFont("helvetica", "bold");
        pdf.text(store.name || "Store", margin, y);

        pdf.setFontSize(24);
        pdf.text("INVOICE", pageWidth - margin, y, {
            align: "right",
        });

        y += 22;

        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(100);

        pdf.text(`@${slug}`, margin, y);

        pdf.text(
            `Invoice #: ${sale.invoiceNumber}`,
            pageWidth - margin,
            y,
            { align: "right" },
        );

        y += 14;

        pdf.text(
            `Date: ${new Date(sale.saleDate).toLocaleDateString()}`,
            pageWidth - margin,
            y,
            { align: "right" },
        );

        // Header divider
        y += 20;
        pdf.setDrawColor(220);
        pdf.line(margin, y, pageWidth - margin, y);

        // Billing information
        y += 28;

        pdf.setFontSize(9);
        pdf.setTextColor(110);
        pdf.text("BILL TO", margin, y);

        pdf.setFontSize(11);
        pdf.setTextColor(30);
        pdf.setFont("helvetica", "bold");
        pdf.text(customerName || "Walk-in customer", margin, y + 18);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(110);

        pdf.text("PAYMENT STATUS", pageWidth - margin, y, {
            align: "right",
        });
        pdf.setFontSize(10);
        pdf.setTextColor(30);
        pdf.text(
            String(sale.status || "").toUpperCase(),
            pageWidth - margin,
            y + 18,
            { align: "right" },
        );

        y += 65;

        // Table header
        const itemX = margin;
        const qtyX = 330;
        const priceX = 415;
        const totalX = pageWidth - margin;

        pdf.setFillColor(245, 245, 245);
        pdf.rect(margin, y - 14, pageWidth - margin * 2, 28, "F");

        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(50);

        pdf.text("ITEM", itemX + 8, y + 3);
        pdf.text("QTY", qtyX, y + 3, { align: "right" });
        pdf.text("UNIT PRICE", priceX, y + 3, { align: "right" });
        pdf.text("TOTAL", totalX - 8, y + 3, { align: "right" });

        y += 38;

        // Item row
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(30);

        const description = String(sale.itemDescription || "");

        pdf.text(description, itemX + 8, y, {
            maxWidth: 250,
        });

        pdf.text(String(sale.quantity ?? 0), qtyX, y, {
            align: "right",
        });

        pdf.text(
            formatMoney(sale.unitPrice, currency),
            priceX,
            y,
            { align: "right" },
        );

        pdf.text(
            formatMoney(sale.total, currency),
            totalX - 8,
            y,
            { align: "right" },
        );

        y += 25;

        pdf.setDrawColor(225);
        pdf.line(margin, y, pageWidth - margin, y);

        // Totals
        y += 30;

        const totalsLabelX = pageWidth - 180;
        const totalsValueX = pageWidth - margin;

        pdf.setFontSize(10);
        pdf.setTextColor(80);

        pdf.text("Subtotal", totalsLabelX, y);
        pdf.text(
            formatMoney(sale.subtotal, currency),
            totalsValueX,
            y,
            { align: "right" },
        );

        y += 20;

        pdf.text("Tax", totalsLabelX, y);
        pdf.text(
            formatMoney(sale.tax, currency),
            totalsValueX,
            y,
            { align: "right" },
        );

        y += 20;

        pdf.text("Discount", totalsLabelX, y);
        pdf.text(
            formatMoney(sale.discount, currency),
            totalsValueX,
            y,
            { align: "right" },
        );

        y += 12;

        pdf.setDrawColor(180);
        pdf.line(totalsLabelX, y, totalsValueX, y);

        y += 28;

        pdf.setFontSize(13);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(20);

        pdf.text("TOTAL", totalsLabelX, y);

        pdf.text(
            formatMoney(sale.total, currency),
            totalsValueX,
            y,
            { align: "right" },
        );

        // Due date
        if (sale.dueDate) {
            y += 45;

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(9);
            pdf.setTextColor(100);

            pdf.text(
                `Due date: ${new Date(sale.dueDate).toLocaleDateString()}`,
                margin,
                y,
            );
        }

        // Notes
        if (sale.notes) {
            y += 40;

            pdf.setFontSize(9);
            pdf.setTextColor(100);
            pdf.text("NOTES", margin, y);

            pdf.setFontSize(10);
            pdf.setTextColor(40);

            const noteLines = pdf.splitTextToSize(
                String(sale.notes),
                pageWidth - margin * 2,
            );

            pdf.text(noteLines, margin, y + 18);
        }

        // Footer
        pdf.setFontSize(9);
        pdf.setTextColor(140);
        pdf.text(
            "Thank you for your business.",
            pageWidth / 2,
            pageHeight - 40,
            { align: "center" },
        );

        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);

        window.open(pdfUrl, "_blank");
    };

    return (
        <button
            className={
                isIcon
                    ? "btn btn-ghost btn-sm btn-square"
                    : "btn btn-primary"
            }
            type="button"
            aria-label={isIcon ? `Print ${sale.invoiceNumber}` : undefined}
            onClick={handleDownload}
        >
            <FiPrinter aria-hidden="true" />
            {!isIcon && "Print / Download PDF"}
        </button>
    );
}