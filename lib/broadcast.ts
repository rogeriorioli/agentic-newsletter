
import { prisma } from "@/lib/prisma";
import { runDiscovery } from "@/lib/tavily";
import { generateNewsletterContent } from "@/lib/gemini";
import { generateMjmlEmail } from "@/lib/mjml";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function broadcastNewsletter() {
  console.log("Starting broadcast...");
  
  try {
      // 1. Fetch active users
      // Busca todos os inscritos (Subscriber)
      const subscribers = await prisma.subscriber.findMany();
      console.log(`Found ${subscribers.length} subscribers.`);

      for (const subscriber of subscribers) {
        try {
            console.log(`Processing subscriber: ${subscriber.email}`);
            
            // a. Call Agent (Discovery + Generation)
            // Primeiro busca as notícias (Discovery)
            const newsData = await runDiscovery(subscriber.country, subscriber.topics);
            
            // Depois gera o conteúdo (Gemini)
            const { subject, html: contentHtml } = await generateNewsletterContent(newsData, subscriber.language);
            
            // b. Transform content to HTML (MJML)
          const finalHtml = generateMjmlEmail(contentHtml);
          
            // c. Send Email via Resend
          const fromEmail = process.env.RESEND_FROM_EMAIL || 'emails@mails.convertesites.com.br';
            const { data, error } = await resend.emails.send({
                from: `News Agentic <${fromEmail}>`,
                to: subscriber.email,
                subject: subject,
                html: finalHtml,
            });

            if (error) {
                // Se houver erro no envio, lançamos para cair no catch e não salvar log como SENT
                throw new Error(`Resend error: ${error.message} (Code: ${error.name})`);
            }

            // d. Create log record
            await prisma.newsletterLog.create({
                data: {
                    subject: subject,
                    topic: subscriber.topics.join(", "),
                    content: finalHtml,
                    recipientCount: 1,
                    status: 'SENT',
                    // sentAt default is now()
                }
            });

            console.log(`Email sent successfully to ${subscriber.email}. Log created.`);

            // e. Wait 500ms
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (innerError: any) {
            console.error(`Error processing subscriber ${subscriber.email}:`, innerError);
            // Continues to next subscriber because of try/catch inside loop
        }
      }
  } catch (outerError) {
      console.error("Critical error in broadcast execution:", outerError);
      throw outerError;
  }
  
  console.log("Broadcast completed.");
}
