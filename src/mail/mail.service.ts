import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
   async sendMail(to: string, subject: string, message: string) {
      console.log(`
         ======= Simulated Email =======
         To: ${to}
         Subject: ${subject}
         Message:
         ${message}
         ===============================
       `);
   }
}
