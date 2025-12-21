"use client";

import { useRef, useState } from "react";

const TOPICS = [
  "IA",
  "Dev",
  "Cripto",
  "Tecnologia",
  "Política",
  "Futebol",
  "Jiu Jitsu",
  "Games",
];

export default function SubscribeForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email"),
      language: formData.get("language"),
      country: formData.get("country"),
      topics: formData.getAll("topics"),
    };

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Inscrição realizada com sucesso!");
        formRef.current?.reset();
      } else {
        setStatus("error");
        setMessage(result.error || "Erro ao realizar inscrição.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Erro de conexão. Tente novamente.");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm sm:w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          News Agentic
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Personalize seu feed de notícias diário
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400"
            placeholder="seu@email.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Language Select */}
          <div className="space-y-2">
            <label htmlFor="language" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Idioma
            </label>
            <div className="relative">
              <select
                id="language"
                name="language"
                defaultValue="pt"
                className="w-full appearance-none px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="pt">Português (PT)</option>
                <option value="en">English (EN)</option>
                <option value="es">Español (ES)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-zinc-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Country Select */}
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              País
            </label>
            <div className="relative">
              <select
                id="country"
                name="country"
                defaultValue="br"
                className="w-full appearance-none px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="br">Brasil</option>
                <option value="us">United States</option>
                <option value="world">Resto do Mundo</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-zinc-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Topics Checkboxes */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block">
            Interesses
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            {TOPICS.map((topic) => (
              <label
                key={topic}
                className="
                  relative flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-200
                  border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600
                  has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-900/20
                "
              >
                <input
                  type="checkbox"
                  name="topics"
                  value={topic}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-zinc-300 dark:border-zinc-600 peer"
                />
                <span className="ml-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 peer-checked:text-blue-700 dark:peer-checked:text-blue-300">
                  {topic}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className={`
            w-full py-3.5 px-4 rounded-xl text-white font-semibold text-sm tracking-wide
            bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700
            transform transition-all duration-200 active:scale-[0.98]
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900
            ${status === "loading" ? "opacity-70 cursor-not-allowed" : "shadow-lg shadow-blue-500/25"}
          `}
        >
          {status === "loading" ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </span>
          ) : (
            "Inscrever-se"
          )}
        </button>

        {/* Feedback Messages */}
        {message && (
          <div className={`p-4 rounded-xl text-sm font-medium animate-fade-in ${
            status === 'success' 
              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
