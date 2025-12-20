## 📅 Plano de Desenvolvimento Detalhado

### Dia 1: Estrutura Base e Banco de Dados

O objetivo hoje é ter o projeto rodando localmente e o banco pronto para receber inscritos.

* **Setup:** `npx create-next-app@latest ai-newsletter`
* **Libs:** `@prisma/client`, `@google/generative-ai`, `@tavily/core`, `resend`, `zod`, `mjml`.
* **DB:** Configurar o `schema.prisma` com o modelo `Subscriber`.

### Dia 2: Frontend e Captura de Leads

Interface onde o usuário escolhe seus interesses.

* **Formulário:** Inputs de E-mail, Selects para País/Idioma e Checkboxes para Temas.
* **API:** Rota `/api/subscribe` para salvar no MongoDB via Prisma.

### Dia 3: O Cérebro do Agente (Core Logic)

A "mágica" agêntica:

* **Search & Synthesis:** Função que integra Tavily (busca) com Gemini (raciocínio).
* **Prompt Engineering:** Instruir o Gemini a formatar especificamente para o idioma do usuário.

### Dia 4: Integração Resend e Loop de Envio

Transformar o conteúdo em e-mails reais.

* **MJML Integration:** Usar MJML para garantir que o layout gerado pela IA seja responsivo.
* **Batch Logic:** Rota que processa todos os inscritos e dispara os envios.

### Dia 5: Deploy e Automação na Vercel

O agente ganha vida própria:

* **Vercel Cron:** Configurar o `vercel.json` para o agendamento (ex: toda segunda às 9h).
* **Teste Final:** Cadastro real e validação do recebimento.

---

Bora parar de só dar "oi" pro ChatGPT e começar a construir ferramentas que realmente entregam valor de forma autônoma. 🚀
