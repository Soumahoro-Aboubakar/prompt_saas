const { Resend } = require('resend');
const getResendClient = () => {
    if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is not set');
    }
    return new Resend(process.env.RESEND_API_KEY);
};

const getFromAddress = () => {
    if (!process.env.EMAIL_FROM) {
        throw new Error('EMAIL_FROM is not set (use a verified sender)');
    }
    return process.env.EMAIL_FROM;
};

const sendEmail = async ({ to, subject, html, text }) => {
    const resend = getResendClient();
    const response = await resend.emails.send({
        from: getFromAddress(),
        to,
        subject,
        html,
        text
    });

    if (response?.error) {
        const msg = response.error.message || 'Email provider error';
        const error = new Error(msg);
        error.details = response.error;
        throw error;
    }

    return response;
};

const buildResetPasswordEmail = ({ name, resetUrl }) => {
    const safeName = name || 'Utilisateur';
    return {
        subject: 'Réinitialisation de votre mot de passe',
        html: `
            <div style="font-family: Arial, sans-serif; color: #111;">
                <h2>Bonjour ${safeName},</h2>
                <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
                <p>
                    Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :
                </p>
                <p>
                    <a href="${resetUrl}" style="display: inline-block; padding: 12px 20px; background: #6d28d9; color: #fff; text-decoration: none; border-radius: 8px;">
                        Réinitialiser mon mot de passe
                    </a>
                </p>
                <p style="margin-top: 16px; font-size: 14px; color: #555;">
                    Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
                </p>
            </div>
        `,
        text: `Bonjour ${safeName},\n\nVous avez demandé la réinitialisation de votre mot de passe.\n\nLien: ${resetUrl}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet email.`
    };
};

const buildVerifyEmail = ({ name, otpCode, expiresInMinutes }) => {
    const safeName = name || 'Utilisateur';
    return {
        subject: 'Votre code de verification PromptAcademy',
        html: `
            <div style="font-family: Arial, sans-serif; color: #111;">
                <h2>Bonjour ${safeName},</h2>
                <p>Entrez ce code pour verifier votre adresse email :</p>
                <p>
                    <span style="display: inline-block; padding: 12px 20px; background: #f4f4f5; color: #111; border-radius: 8px; font-size: 28px; font-weight: 700; letter-spacing: 6px;">
                        ${otpCode}
                    </span>
                </p>
                <p style="margin-top: 12px; font-size: 14px; color: #555;">
                    Ce code expire dans ${expiresInMinutes} minutes.
                </p>
                <p style="margin-top: 16px; font-size: 14px; color: #555;">
                    Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
                </p>
            </div>
        `,
        text: `Bonjour ${safeName},\n\nVotre code de verification est : ${otpCode}\nCe code expire dans ${expiresInMinutes} minutes.\n\nSi vous n'etes pas a l'origine de cette demande, ignorez cet email.`
    };
};

const buildWelcomeEmail = ({ name }) => {
    const safeName = name || 'Utilisateur';
    return {
        subject: 'Bienvenue sur PromptAcademy',
        html: `
            <div style="font-family: Arial, sans-serif; color: #111;">
                <h2>Bienvenue ${safeName} !</h2>
                <p>Votre compte est créé. Vous pouvez maintenant commencer votre parcours de formation.</p>
                <p>Bon apprentissage !</p>
            </div>
        `,
        text: `Bienvenue ${safeName} !\n\nVotre compte est créé. Vous pouvez maintenant commencer votre parcours de formation.\n\nBon apprentissage !`
    };
};

module.exports = {
    sendEmail,
    buildResetPasswordEmail,
    buildVerifyEmail,
    buildWelcomeEmail
};
