interface Attachment {
  filename: string;
  content: string;
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  attachments?: Attachment[];
}

export abstract class EmailService {
  abstract send(input: SendEmailInput): Promise<void>;
}
