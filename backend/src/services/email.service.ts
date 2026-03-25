import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import type { VerificationEmailDTO } from '../types/email.types.js';

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});

export async function sendVerificationEmail(dto: VerificationEmailDTO) {
    try {
        await transporter.sendMail({
            from: env.SMTP_USER,
            to: dto.to,
            subject: 'Weryfikacja adresu email - TAW Rezerwacje',
            html: `
            <h2>Potwierdź swój adres email</h2>
            <p>Kliknij w poniższy przycisk, aby zweryfikować swój adres email i ukończyć rejestrację:</p>
            <a href="${dto.verificationLink}" style="display:inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #5659ff; text-decoration: none; border-radius: 5px; margin-top: 15px;">Zweryfikuj konto</a>
            <p style="margin-top: 25px; font-size: 12px; color: #777;">Jeżeli to nie Ty zakładałeś konto, zignoruj tę wiadomość.</p>
            `,
        });
        console.log(`Email weryfikacyjny został wysłany do: ${dto.to}`);
    } catch (error) {
        console.error('Błąd podczas wysyłania emaila weryfikacyjnego:', error);
    }
}
