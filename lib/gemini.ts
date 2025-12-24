import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateNewsletterContent(newsData: any, language: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Atue como um editor de newsletter experiente (Chief Editor).
    
    OBJETIVO:
    Receba os dados brutos de notícias (JSON) abaixo e transforme-os em um conteúdo estruturado, profissional e inovador para os nossos leitores.

    IDIOMA DO CONTEÚDO: ${language}

    DADOS BRUTOS (Notícias):
    ${JSON.stringify(newsData, null, 2)}

    INSTRUÇÕES DE FORMATAÇÃO (CRÍTICO):
    - O output deve ser um objeto JSON estritamente válido.
    - O JSON deve ter duas chaves: "subject" (assunto do e-mail) e "html" (conteúdo HTML).
    - Para o "subject": Crie um assunto curto, chamativo e relevante para as notícias processadas.
    - Para o "html":
        - O conteúdo deve ser HTML limpo para ser inserido dentro de uma tag <mj-text> do MJML.
        - Use tags HTML padrão como <h3> para títulos de seções, <strong> para destaques, <p> para parágrafos, <ul>/<li> para listas, e <a href="..."> para links.
        - NÃO inclua tags <html>, <head>, <body> ou <mj-text>. Apenas o conteúdo interno.
        - Adicione um título chamativo no início (<h2>).
    
    ESTILO:
    - Tom profissional, curador, perspicaz e inovador.
    - Resuma as notícias focando no impacto e no "porquê isso importa".
    - Se houver muitas notícias, agrupe-as por temas ou selecione as 3-5 mais impactantes.
    - Inclua os links para as fontes originais nas notícias citadas.

    Exemplo de formato de saída:
    {
      "subject": "As principais novidades de IA da semana",
      "html": "<h2>Destaques</h2><p>...</p>"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Remove markdown formatting if present (```json ... ```)
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const jsonContent = JSON.parse(text);
    return {
        subject: jsonContent.subject || "Newsletter News Agentic",
        html: jsonContent.html || text
    };
  } catch (error) {
    console.error("Error generating newsletter content with Gemini:", error);
    // Fallback in case of parsing error, though we try to return a structural error or plain text if possible, but safer to throw or return partial
    throw error;
  }
}
