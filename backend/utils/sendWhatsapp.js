import axios from "axios";

export const sendWhatsAppMessage = async (to, message, pdfUrl) => {
  try {
    const phone = to.startsWith("91") ? to : `91${to}`;
    const url = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

    const data = {
      messaging_product: "whatsapp",
      to: phone,
      type: "document",
      document: {
        link: pdfUrl,
        caption: message,
        filename: "BusTicket.pdf",
      },
    };

    await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ WhatsApp ticket sent to:", phone);
  } catch (err) {
    console.error("❌ WhatsApp send error:", err.response?.data || err.message);
  }
};
