import emailjs from '@emailjs/browser';

interface EmailTemplateParams {
  to_email: string;
  subject: string;
  message: string;
  tournament_title?: string;
  priority?: string;
}

interface RegistrationEmailParams {
  to_email: string;
  tournament_title: string;
  tournament_date: string;
  tournament_location: string;
  team_name: string;
  coach_name: string;
  email: string;
  phone: string;
  age_group: string;
  skill_level: string;
  entry_fee: string;
}

interface ConfirmationEmailParams {
  to_email: string;
  coach_name: string;
  team_name: string;
  tournament_title: string;
  tournament_date: string;
  tournament_location: string;
  age_group: string;
  entry_fee: string;
}

const handleEmailError = (error: any, context: string) => {
  console.error(`Email error (${context}):`, error);
  if (error.status === 400) {
    if (error.text?.includes('Public Key is invalid')) {
      throw new Error('Email service not properly configured. Please contact support.');
    }
    if (error.text?.includes('service ID not found')) {
      throw new Error('Email service temporarily unavailable. Please try again later.');
    }
    if (error.text?.includes('template ID')) {
      throw new Error('Email template configuration error. Please contact support.');
    }
  }
  throw error;
};

export const sendRegistrationEmail = async (params: RegistrationEmailParams) => {
  try {
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_REGISTRATION;
    if (!templateId) {
      console.warn('Registration email template ID not configured');
      return;
    }

    const emailContent = `
New Tournament Registration

Tournament: ${params.tournament_title}
Date: ${params.tournament_date}
Location: ${params.tournament_location}

Team Information:
- Team Name: ${params.team_name}
- Coach: ${params.coach_name}
- Age Group: ${params.age_group}
- Skill Level: ${params.skill_level}

Contact Information:
- Email: ${params.email}
- Phone: ${params.phone}

Entry Fee: ${params.entry_fee}
    `.trim();

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId,
      {
        to_email: params.to_email,
        from_name: "CKG Tournaments",
        subject: `New Tournament Registration - ${params.tournament_title}`,
        message: emailContent,
        tournament_title: params.tournament_title,
        tournament_date: params.tournament_date,
        tournament_location: params.tournament_location,
        team_name: params.team_name,
        coach_name: params.coach_name,
        email: params.email,
        phone: params.phone,
        age_group: params.age_group,
        skill_level: params.skill_level,
        entry_fee: params.entry_fee
      }
    );
  } catch (error) {
    handleEmailError(error, 'registration');
  }
};

export const sendRegistrationConfirmationEmail = async (params: ConfirmationEmailParams) => {
  try {
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONFIRMATION;
    if (!templateId) {
      console.warn('Confirmation email template ID not configured');
      return;
    }

    const halfEntryFee = params.entry_fee.replace(/\$(\d+)/, (_, amount) => `$${parseInt(amount) / 2}`);
    
    const emailContent = `
Dear ${params.coach_name},

Thank you for registering ${params.team_name} for the ${params.tournament_title}!

Tournament Details:
- Date: ${params.tournament_date}
- Location: ${params.tournament_location}
- Age Group: ${params.age_group}
- Entry Fee: ${params.entry_fee}

Important Payment Information:
A deposit of ${halfEntryFee} (50% of the entry fee) is required to secure your spot in the tournament.

Payment Methods:
1. CashApp: $ckgtournamets
2. Venmo: @Jeffery-Nash-2

Please include your team name and tournament date in the payment description.

If you need additional payment options, please contact us at CKGtournaments@gmail.com.

Please keep this email for your records. If you have any questions, feel free to contact us at ckgtournaments@gmail.com.

We look forward to seeing you at the tournament!

Best regards,
CKG Tournaments Team
    `.trim();

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId,
      {
        to_email: params.to_email,
        from_name: "CKG Tournaments",
        subject: `Tournament Registration Confirmation - ${params.tournament_title}`,
        message: emailContent,
        tournament_title: params.tournament_title,
        tournament_date: params.tournament_date,
        tournament_location: params.tournament_location,
        team_name: params.team_name,
        coach_name: params.coach_name,
        age_group: params.age_group,
        entry_fee: params.entry_fee,
        half_entry_fee: halfEntryFee
      }
    );
  } catch (error) {
    handleEmailError(error, 'confirmation');
  }
};

export const sendAnnouncementEmail = async (
  priority: 'low' | 'medium' | 'high',
  params: EmailTemplateParams
) => {
  try {
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    if (!templateId) {
      console.warn('Announcement email template ID not configured');
      return;
    }
    
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId,
      {
        ...params,
        from_name: "CKG Tournaments",
        priority_level: priority.toUpperCase(),
        notification_type: 'Tournament Announcement'
      }
    );
  } catch (error) {
    handleEmailError(error, 'announcement');
  }
};