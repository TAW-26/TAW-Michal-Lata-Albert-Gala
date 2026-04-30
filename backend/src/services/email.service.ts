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

export async function sendForgotPasswordEmail(
  dto: import('../types/email.types.js').ForgotPasswordEmailDTO
) {
  try {
    await transporter.sendMail({
      from: env.SMTP_USER,
      to: dto.to,
      subject: 'Reset hasła - TAW Rezerwacje',
      html: `
            <h2>Resetowanie hasła</h2>
            <p>Kliknij w poniższy przycisk, aby zresetować swoje hasło:</p>
            <a href="${dto.resetLink}" style="display:inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #5659ff; text-decoration: none; border-radius: 5px; margin-top: 15px;">Zresetuj hasło</a>
            <p style="margin-top: 25px; font-size: 12px; color: #777;">Jeżeli to nie Ty prosiłeś o reset hasła, zignoruj tę wiadomość.</p>
            `,
    });
    console.log(`Email z resetem hasła został wysłany do: ${dto.to}`);
  } catch (error) {
    console.error('Błąd podczas wysyłania emaila do resetu hasła:', error);
  }
}

export async function sendReservationConfirmationEmail(
  dto: import('../types/email.types.js').ReservationEmailDTO
) {
  try {
    await transporter.sendMail({
      from: env.SMTP_USER,
      to: dto.to,
      subject: `Potwierdzenie rezerwacji: ${dto.facilityName} - TAW Rezerwacje`,
      html: `
            <h2>Potwierdzenie rezerwacji</h2>
            <p>Witaj <strong>${dto.userName}</strong>,</p>
            <p>Twoja rezerwacja została pomyślnie utworzona. Poniżej znajdują się szczegóły:</p>
            <div style="background-color: #f4f7ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p><strong>Obiekt:</strong> ${dto.facilityName}</p>
              <p><strong>Data:</strong> ${dto.date}</p>
              <p><strong>Godzina:</strong> ${dto.time}</p>
            </div>
            <h3>Twoje dane z formularza:</h3>
            <ul>
              <li><strong>Email:</strong> ${dto.userEmail}</li>
              <li><strong>Telefon:</strong> ${dto.userPhone}</li>
            </ul>
            <p style="margin-top: 25px;">Dziękujemy za skorzystanie z naszego serwisu!</p>
            <p style="font-size: 12px; color: #777;">To jest wiadomość automatyczna, prosimy na nią nie odpowiadać.</p>
            `,
    });
    console.log(`Email z potwierdzeniem rezerwacji został wysłany do: ${dto.to}`);
  } catch (error) {
    console.error('Błąd podczas wysyłania emaila z potwierdzeniem rezerwacji:', error);
  }
}

export async function sendReservationApprovedEmail(
  dto: import('../types/email.types.js').ReservationStatusEmailDTO
) {
  try {
    await transporter.sendMail({
      from: env.SMTP_USER,
      to: dto.to,
      subject: `Rezerwacja zatwierdzona: ${dto.facilityName} - TAW Rezerwacje`,
      html: `
            <h2 style="color: #52c41a;">✅ Rezerwacja zatwierdzona</h2>
            <p>Witaj <strong>${dto.userName}</strong>,</p>
            <p>Twoja rezerwacja została <strong>zatwierdzona</strong> przez administratora.</p>
            <div style="background-color: #f6ffed; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #52c41a;">
              <p><strong>Obiekt:</strong> ${dto.facilityName}</p>
              <p><strong>Data:</strong> ${dto.date}</p>
              <p><strong>Godzina:</strong> ${dto.time}</p>
            </div>
            <p>Do zobaczenia!</p>
            <p style="font-size: 12px; color: #777;">To jest wiadomość automatyczna, prosimy na nią nie odpowiadać.</p>
            `,
    });
    console.log(`Email z zatwierdzeniem rezerwacji wysłany do: ${dto.to}`);
  } catch (error) {
    console.error('Błąd wysyłania emaila z zatwierdzeniem:', error);
  }
}

export async function sendReservationRejectedEmail(
  dto: import('../types/email.types.js').ReservationStatusEmailDTO
) {
  try {
    const reasonBlock = dto.reason
      ? `<p><strong>Powód odmowy:</strong> ${dto.reason}</p>`
      : '';

    await transporter.sendMail({
      from: env.SMTP_USER,
      to: dto.to,
      subject: `Rezerwacja odrzucona: ${dto.facilityName} - TAW Rezerwacje`,
      html: `
            <h2 style="color: #ff4d4f;">❌ Rezerwacja odrzucona</h2>
            <p>Witaj <strong>${dto.userName}</strong>,</p>
            <p>Niestety, Twoja rezerwacja została <strong>odrzucona</strong> przez administratora.</p>
            <div style="background-color: #fff2f0; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ff4d4f;">
              <p><strong>Obiekt:</strong> ${dto.facilityName}</p>
              <p><strong>Data:</strong> ${dto.date}</p>
              <p><strong>Godzina:</strong> ${dto.time}</p>
              ${reasonBlock}
            </div>
            <p>Zapraszamy do ponownej rezerwacji w innym terminie.</p>
            <p style="font-size: 12px; color: #777;">To jest wiadomość automatyczna, prosimy na nią nie odpowiadać.</p>
            `,
    });
    console.log(`Email z odrzuceniem rezerwacji wysłany do: ${dto.to}`);
  } catch (error) {
    console.error('Błąd wysyłania emaila z odrzuceniem:', error);
  }
}

