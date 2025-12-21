import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Email inválido"),
  topics: z.array(z.string()).min(1, "Selecione pelo menos um interesse"),
  language: z.string().default("pt"),
  country: z.string().default("br"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body with Zod
    const validationResult = subscribeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, topics, language, country } = validationResult.data;

    // Upsert subscriber: update if exists, create if not
    const subscriber = await prisma.subscriber.upsert({
      where: { email },
      update: {
        language,
        country,
        topics,
      },
      create: {
        email,
        language,
        country,
        topics,
      },
    });

    return NextResponse.json({ success: true, data: subscriber });
  } catch (error) {
    console.error("Error subscribing:", error);
    return NextResponse.json(
      { error: "Erro ao processar inscrição" },
      { status: 500 }
    );
  }
}
