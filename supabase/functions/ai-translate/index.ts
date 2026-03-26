import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get('ALLOWED_ORIGIN') ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TranslationRequest {
  sourceText: string;
  sourceLanguage: string;
  targetLanguages: { code: string; name: string }[];
}

interface TranslationResponse {
  translations: Record<string, string>;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI translation service not configured. Please add OPENAI_API_KEY." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { sourceText, sourceLanguage, targetLanguages }: TranslationRequest = await req.json();

    if (!sourceText || !targetLanguages || targetLanguages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: sourceText, targetLanguages" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Translating "${sourceText.substring(0, 50)}..." from ${sourceLanguage} to ${targetLanguages.length} languages`);

    // Build the prompt for translation
    const languageList = targetLanguages
      .map(lang => `- ${lang.code}: ${lang.name}`)
      .join("\n");

    const systemPrompt = `You are a professional translator. Your task is to translate the given text accurately.

## GLOSSARY TERMS - DO NOT TRANSLATE (preserve exactly as-is):
- Brand names: HostOnce, Google, WordPress, Cloudflare, Microsoft, Amazon, etc.
- Product/service names that are proper nouns
- Technical abbreviations: API, SSL, TLS, SSH, DNS, CDN, SSD, HDD, NVMe, RAM, CPU, GPU, VPS, RAID
- Units of measurement: GB, TB, MB, Gbps, MHz, GHz, ms (keep unchanged)
- Email addresses, URLs, and domain names
- Version numbers and tier names: v2.0, Pro, Enterprise, Basic, Premium, Starter
- Proper nouns and company names
- Currency codes: USD, EUR, etc.

## TRANSLATE THESE:
- All descriptive text, headings, and paragraphs
- Button labels and calls-to-action (e.g., "Get Started" → translate, "Learn More" → translate)
- Common words and phrases
- Descriptive parts around brand names (e.g., "Powered by Google" → translate "Powered by", keep "Google")
- Price descriptions (but keep currency symbols and numbers in appropriate format)

## FORMATTING RULES:
- Preserve HTML entities and special characters
- Keep placeholders like {name}, {{variable}}, %s, %d unchanged
- For Arabic (ar): Use RTL-appropriate punctuation and formatting
- Adapt number formats to target locale where appropriate

Return ONLY a valid JSON object with language codes as keys and translations as values. No markdown, no explanation, just the JSON object.`;

    const userPrompt = `Translate the following text from ${sourceLanguage} to these languages:

${languageList}

Text to translate:
"${sourceText}"

Return a JSON object like this:
{
  "ar": "Arabic translation here",
  "fr": "French translation here",
  ...
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_completion_tokens: 8192,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limited by AI gateway");
        return new Response(
          JSON.stringify({ error: "Translation service is busy. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.error("Payment required for AI gateway");
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue using translation." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get translations from AI service" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response:", aiResponse);
      return new Response(
        JSON.stringify({ error: "AI returned empty response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON response from AI
    let translations: Record<string, string>;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();
      
      translations = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content, parseError);
      return new Response(
        JSON.stringify({ error: "Failed to parse translation response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Successfully translated to ${Object.keys(translations).length} languages`);

    const result: TranslationResponse = { translations };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
