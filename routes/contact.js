const express = require("express");
const { Resend } = require("resend");

const router = express.Router();

const resend = new Resend(process.env.c);

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "All fields are required.",
      });
    }

    const { error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: ["neyamulislam946@gmail.com"],
      replyTo: email,
      subject: `Portfolio Contact from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
    });

    if (error) {
      console.error("Resend Error:", error);

      return res.status(500).json({
        error: "Failed to send email.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Email sent successfully.",
    });

  } catch (error) {
    console.error("Server Error:", error);

    res.status(500).json({
      error: "Something went wrong.",
    });
  }
});

module.exports = router;