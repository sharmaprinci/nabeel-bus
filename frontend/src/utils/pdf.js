import jsPDF from "jspdf";
import "jspdf-autotable";

console.log("✅ jsPDF ready:", typeof jsPDF);
console.log("✅ autoTable attached:", typeof jsPDF.API?.autoTable);

export default jsPDF;
