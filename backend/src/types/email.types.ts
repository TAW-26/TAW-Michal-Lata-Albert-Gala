export interface EmailDTO {
    to: string;
    subject: string;
    text: string;
}

export interface VerificationEmailDTO {
    to: string;
    verificationLink: string;
}