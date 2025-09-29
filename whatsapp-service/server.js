const express = require("express");
const qrcode = require("qrcode-terminal");

const app = express();
const PORT = 4000;

let sock; // global socket

app.use(express.json());

async function startWA() {
    const { default: makeWASocket, useMultiFileAuthState } = await import("@whiskeysockets/baileys");
    const { state, saveCreds } = await useMultiFileAuthState("auth_info");
    sock = makeWASocket({ auth: state });
    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection, qr, lastDisconnect } = update;

        if (qr) {
            console.log("Scan this QR code with your WhatsApp:");
            qrcode.generate(qr, { small: true });
        }

        if (connection === "open") {
            console.log("✅ WhatsApp connection established!");
        }

        if (connection === "close") {
            console.log("Connection closed. Reason:", lastDisconnect?.error?.message || "unknown");
            // try to reconnect
            setTimeout(startWA, 5000);
        }
    });
}

// start WhatsApp connection
startWA();

// route to send OTP
app.get("/send-otp", async (req, res) => {
    const phone = (req.query.phone || "").replace(/\D/g, ''); // remove non-digit chars
    const otp = req.query.otp;

    if (!phone || !otp) {
        return res.status(400).json({ success: false, message: "Phone and OTP required" });
    }

    if (!sock) {
        return res.status(500).json({ success: false, message: "WhatsApp not connected yet" });
    }

    try {
        await sock.sendMessage(`${phone}@s.whatsapp.net`, { text: `Kode OTP kamu adalah: ${otp} jangan bagikan ke siapapun!` });
        res.json({ success: true, message: "OTP sent via WhatsApp" });
    } catch (err) {
        console.error("Failed to send OTP:", err);
        res.status(500).json({ success: false, message: "Failed to send OTP", error: err.message });
    }
});

app.listen(PORT, () => console.log(`WhatsApp service running on port ${PORT}`));
