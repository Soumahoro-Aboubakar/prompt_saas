const axios = require("axios");
const EmailLog = require("../models/EmailLog");
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";



async function sendEmail({ to, subject, html, text, toName }) {
    if (!process.env.BREVO_API_KEY) {
        throw new Error("BREVO_API_KEY is missing");
    }

    if (!process.env.BREVO_SENDER_EMAIL) {
        throw new Error("BREVO_SENDER_EMAIL is missing");
    }

    // --- Rate Limiting Logic ---
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Insert log first to prevent race condition (concurrent requests bypassing the check)
    const log = new EmailLog({ email: to });
    await log.save();

    // Check how many emails have been sent in the last 24 hours
    const count = await EmailLog.countDocuments({
        email: to,
        sentAt: { $gte: twentyFourHoursAgo }
    });

    if (count > 4) {
        // Limit exceeded, remove the log we just inserted
        await EmailLog.findByIdAndDelete(log._id);

        // Find the oldest of the 4 valid logs to find when the limit will reset
        const oldestLog = await EmailLog.findOne({
            email: to,
            sentAt: { $gte: twentyFourHoursAgo }
        })
            .sort({ sentAt: 1 });

        let hours = 0, minutes = 0, seconds = 0;

        if (oldestLog) {
            const resetTimeMs = oldestLog.sentAt.getTime() + 24 * 60 * 60 * 1000;
            const remainingMs = Math.max(0, resetTimeMs - Date.now());

            hours = Math.floor(remainingMs / (1000 * 60 * 60));
            minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
            seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
        }

        const rateLimitError = new Error("Limite d'envoi d'emails atteinte.");
        rateLimitError.status = 429;
        rateLimitError.details = {
            message: "Vous avez atteint la limite de 4 emails par 24 heures.",
            remainingTime: { hours, minutes, seconds }
        };
        throw rateLimitError;
    }

    try {
        const response = await axios.post(
            BREVO_URL,
            {
                sender: {
                    name: process.env.BREVO_SENDER_NAME || "PromptAcademy",
                    email: process.env.BREVO_SENDER_EMAIL,
                },
                to: [
                    {
                        email: to,
                        name: toName || undefined,
                    },
                ],
                subject: subject,
                htmlContent: html,
                ...(text && { textContent: text }),
            },
            {
                headers: {
                    accept: "application/json",
                    "api-key": process.env.BREVO_API_KEY,
                    "content-type": "application/json",
                },
                timeout: 10000,
            }
        );

        //    console.log("✅ Email sent:", response.data.messageId);
        return response.data;

    } catch (error) {
        // If Brevo fails, delete the log so the user is not penalized for our API error
        await EmailLog.findByIdAndDelete(log._id);

        const brevoError =
            error.response?.data ||
            error.response?.body ||
            error.message;

        console.error("❌ Brevo API error:", brevoError);

        throw new Error(
            `Brevo send failed: ${brevoError?.message || JSON.stringify(brevoError)
            }`
        );
    }
}

/* ────────────────────────────────────────────────
   Templates
──────────────────────────────────────────────── */

function buildResetPasswordEmail({ name, resetUrl }) {
    const safeName = name || "Utilisateur";

    return {
        subject: "Réinitialisation de votre mot de passe — PromptAcademy",
        html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333; line-height: 1.6; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eaeaea; margin-bottom: 20px;">
                    <h1 style="color: #6d28d9; margin: 0; font-size: 24px;">PromptAcademy</h1>
                </div>
                <h2 style="color: #2d3748; font-size: 20px; margin-top: 0;">Bonjour ${safeName},</h2>
                <p style="font-size: 16px;">Nous avons reçu une demande de réinitialisation du mot de passe associé à votre compte PromptAcademy.</p>
                <p style="font-size: 16px;">Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
                
                <div style="text-align: center; margin: 35px 0;">
                    <a href="${resetUrl}" 
                       style="padding: 14px 28px; background-color: #6d28d9; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(109, 40, 217, 0.2);">
                       🔐 Réinitialiser mon mot de passe
                    </a>
                </div>

                <p style="font-size: 14px; color: #718096;">⏳ Ce lien est valable pendant <strong>1 heure</strong>. Passé ce délai, vous devrez effectuer une nouvelle demande.</p>
                <p style="font-size: 14px; color: #718096;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité. Votre mot de passe actuel restera inchangé.</p>

                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; text-align: center;">
                    <p style="font-size: 14px; color: #718096; margin: 0;">
                        L'équipe PromptAcademy<br/>
                        <em>Apprenez, Innovez, Maîtrisez.</em>
                    </p>
                </div>
            </div>
        `,
        text: `Bonjour ${safeName},\n\nNous avons reçu une demande de réinitialisation de votre mot de passe PromptAcademy.\n\nCliquez sur le lien suivant pour choisir un nouveau mot de passe :\n${resetUrl}\n\nCe lien est valable pendant 1 heure.\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet email.\n\nL'équipe PromptAcademy`
    };
}

function buildVerifyEmail({ name, otpCode, expiresInMinutes }) {
    const safeName = name || "Utilisateur";

    return {
        subject: "Votre code de vérification — PromptAcademy",
        html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333; line-height: 1.6; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eaeaea; margin-bottom: 20px;">
                    <h1 style="color: #6d28d9; margin: 0; font-size: 24px;">PromptAcademy</h1>
                </div>
                <h2 style="color: #2d3748; font-size: 20px; margin-top: 0;">Bonjour ${safeName},</h2>
                <p style="font-size: 16px;">Pour vérifier votre adresse email, veuillez saisir le code ci-dessous dans le champ prévu à cet effet :</p>
                
                <div style="text-align: center; margin: 35px 0;">
                    <div style="display: inline-block; padding: 16px 32px; background-color: #f5f3ff; border: 2px dashed #6d28d9; border-radius: 12px;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #6d28d9;">${otpCode}</span>
                    </div>
                </div>

                <p style="font-size: 14px; color: #718096;">⏳ Ce code est valable pendant <strong>${expiresInMinutes} minutes</strong>. Passé ce délai, vous devrez en demander un nouveau.</p>
                <p style="font-size: 14px; color: #718096;">Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email en toute sécurité.</p>

                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; text-align: center;">
                    <p style="font-size: 14px; color: #718096; margin: 0;">
                        L'équipe PromptAcademy<br/>
                        <em>Apprenez, Innovez, Maîtrisez.</em>
                    </p>
                </div>
            </div>
        `,
        text: `Bonjour ${safeName},\n\nPour vérifier votre adresse email, saisissez le code suivant :\n\n${otpCode}\n\nCe code est valable pendant ${expiresInMinutes} minutes.\n\nSi vous n'avez pas demandé ce code, ignorez cet email.\n\nL'équipe PromptAcademy`
    };
}

function buildWelcomeEmail({ name }) {
    const safeName = name || "Utilisateur";

    return {
        subject: "Bienvenue sur PromptAcademy - Votre aventure commence ici !",
        html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333; line-height: 1.6; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eaeaea; margin-bottom: 20px;">
                    <h1 style="color: #6d28d9; margin: 0; font-size: 24px;">PromptAcademy</h1>
                </div>
                <h2 style="color: #2d3748; font-size: 20px; margin-top: 0;">Bienvenue ${safeName} ! 🎉</h2>
                <p style="font-size: 16px;">Nous sommes ravis de vous compter parmi nous. Votre compte a été créé avec succès et est maintenant prêt à être utilisé.</p>
                <p style="font-size: 16px;">Sur <strong style="color: #6d28d9;">PromptAcademy</strong>, vous découvrirez les meilleures pratiques en ingénierie de prompts pour maîtriser l'Intelligence Artificielle et booster votre productivité.</p>
                
                <div style="text-align: center; margin: 35px 0;">
                    <a href="https://www.eprompt.site/login" 
                       style="padding: 14px 28px; background-color: #6d28d9; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(109, 40, 217, 0.2);">
                       Accéder à mon espace
                    </a>
                </div>
                
                <p style="font-size: 16px;">Si vous avez la moindre question pour démarrer, n'hésitez pas à répondre directement à cet email.</p>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; text-align: center;">
                    <p style="font-size: 14px; color: #718096; margin: 0;">
                        L'équipe PromptAcademy<br/>
                        <em>Apprenez, Innovez, Maîtrisez.</em>
                    </p>
                </div>
            </div>
        `,
        text: `Bienvenue sur PromptAcademy, ${safeName} ! 🎉\n\nNous sommes ravis de vous compter parmi nous. Votre compte a été créé avec succès et est maintenant prêt à être utilisé.\n\nConnectez-vous à votre espace ici : https://www.eprompt.site/login\n\nL'équipe PromptAcademy`
    };
}

module.exports = {
    sendEmail,
    buildResetPasswordEmail,
    buildVerifyEmail,
    buildWelcomeEmail
};