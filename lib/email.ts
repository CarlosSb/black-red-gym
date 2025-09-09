import nodemailer from "nodemailer"

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"${process.env.FROM_NAME || "Black Red Gym"}" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }

      const info = await this.transporter.sendMail(mailOptions)
      console.log("Email sent:", info.messageId)
      return true
    } catch (error) {
      console.error("Error sending email:", error)
      return false
    }
  }

  async sendAppointmentConfirmation(appointment: {
    name: string
    email: string
    classType: string
    scheduledDate: Date
    scheduledTime: string
    phone: string
  }): Promise<boolean> {
    const formattedDate = appointment.scheduledDate.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const subject = "Confirmação de Agendamento - Black Red Gym"

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmação de Agendamento</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #000000, #8B0000); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B0000; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #8B0000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Agendamento Confirmado!</h1>
            <p>Black Red Gym</p>
          </div>

          <div class="content">
            <h2>Olá ${appointment.name}!</h2>

            <p>Seu agendamento para aula experimental foi realizado com sucesso! Aqui estão os detalhes:</p>

            <div class="appointment-details">
              <h3>📅 Detalhes do Agendamento</h3>
              <p><strong>Tipo de Aula:</strong> ${appointment.classType}</p>
              <p><strong>Data:</strong> ${formattedDate}</p>
              <p><strong>Horário:</strong> ${appointment.scheduledTime}</p>
              <p><strong>Telefone:</strong> ${appointment.phone}</p>
            </div>

            <p><strong>Importante:</strong></p>
            <ul>
              <li>Chegue 15 minutos antes do horário marcado</li>
              <li>Traga uma garrafa de água e toalha</li>
              <li>Use roupas adequadas para atividade física</li>
              <li>Em caso de cancelamento, avise com antecedência</li>
            </ul>

            <p>Estamos ansiosos para recebê-lo e ajudá-lo a alcançar seus objetivos fitness!</p>

            <p>Qualquer dúvida, entre em contato conosco.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:+5511999999999" class="button">📞 Ligar para Academia</a>
            </div>

            <p>Atenciosamente,<br>
            <strong>Equipe Black Red Gym</strong></p>
          </div>

          <div class="footer">
            <p>Este é um e-mail automático. Por favor, não responda diretamente a este e-mail.</p>
            <p>Black Red Gym - Transformando vidas através do fitness</p>
          </div>
        </div>
      </body>
      </html>
    `

    const text = `
      Olá ${appointment.name}!

      Seu agendamento para aula experimental foi realizado com sucesso!

      Detalhes do Agendamento:
      - Tipo de Aula: ${appointment.classType}
      - Data: ${formattedDate}
      - Horário: ${appointment.scheduledTime}
      - Telefone: ${appointment.phone}

      Importante:
      - Chegue 15 minutos antes do horário marcado
      - Traga uma garrafa de água e toalha
      - Use roupas adequadas para atividade física
      - Em caso de cancelamento, avise com antecedência

      Estamos ansiosos para recebê-lo!

      Atenciosamente,
      Equipe Black Red Gym
    `

    return this.sendEmail({
      to: appointment.email,
      subject,
      html,
      text,
    })
  }
}

export const emailService = new EmailService()