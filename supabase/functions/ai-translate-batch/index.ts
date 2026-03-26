import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get('ALLOWED_ORIGIN') ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TranslationItem {
  key: string;
  sourceText: string;
  context?: string;
}

interface BatchTranslationRequest {
  items: TranslationItem[];
  sourceLanguage: string;
  targetLanguages: { code: string; name: string }[];
}

interface BatchTranslationResponse {
  results: Record<string, Record<string, string>>; // key -> { langCode: translation }
  error?: string;
  failedKeys?: string[];
}

serve(async (req) => {
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

    const { items, sourceLanguage, targetLanguages }: BatchTranslationRequest = await req.json();

    console.log('[ai-translate-batch] Request received:', {
      itemsCount: items?.length || 0,
      sourceLanguage,
      targetLanguages: targetLanguages?.map(l => l.code) || [],
      sampleItems: items?.slice(0, 3).map(i => ({ key: i.key, sourceLength: i.sourceText?.length || 0 })),
    });

    if (!items || items.length === 0 || !targetLanguages || targetLanguages.length === 0) {
      console.error('[ai-translate-batch] Missing required fields');
      return new Response(
        JSON.stringify({ error: "Missing required fields: items, targetLanguages" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // CRITICAL: Filter out items with empty, undefined, or literal 'undefined' source text
    // This prevents the AI from literally translating "undefined" to "غير معرّف"
    const validItems = items.filter(item => 
      item.sourceText && 
      typeof item.sourceText === 'string' && 
      item.sourceText.trim() !== '' &&
      item.sourceText !== 'undefined' &&
      item.sourceText !== 'null'
    );

    if (validItems.length === 0) {
      console.warn('No valid items after filtering - all had empty/undefined sourceText');
      return new Response(
        JSON.stringify({ results: {}, error: "No valid items to translate - all source texts were empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (validItems.length < items.length) {
      console.warn(`Filtered out ${items.length - validItems.length} items with invalid sourceText`);
    }

    // Limit batch size to prevent timeout
    const MAX_BATCH_SIZE = 20;
    const batchItems = validItems.slice(0, MAX_BATCH_SIZE);
    
    console.log(`Batch translating ${batchItems.length} items from ${sourceLanguage} to ${targetLanguages.length} languages`);

    const languageList = targetLanguages
      .map(lang => `${lang.code} (${lang.name})`)
      .join(", ");

    // Build batch prompt with numbered items for easier parsing
    const itemsList = batchItems
      .map((item, idx) => `[${idx}] "${item.sourceText}"${item.context ? ` (context: ${item.context})` : ''}`)
      .join("\n");

    const systemPrompt = `You are a professional translator. Translate multiple texts accurately.

## GLOSSARY TERMS - DO NOT TRANSLATE (preserve exactly as-is):
- Brand names: HostOnce, Google, WordPress, Cloudflare, Microsoft, Amazon, etc.
- Product/service names that are proper nouns
- Technical abbreviations: API, SSL, TLS, SSH, DNS, CDN, SSD, HDD, NVMe, RAM, CPU, GPU, VPS, RAID
- Units of measurement: GB, TB, MB, Gbps, MHz, GHz, ms
- Email addresses, URLs, and domain names
- Version numbers and tier names: v2.0, Pro, Enterprise, Basic, Premium, Starter
- Proper nouns and company names
- Currency codes: USD, EUR, etc.

## TRANSLATE THESE:
- All descriptive text, headings, and paragraphs
- Button labels and calls-to-action
- Common words and phrases
- Descriptive parts around brand names

## RULES:
- Preserve HTML entities, placeholders ({name}, {{var}}, %s) unchanged
- For Arabic: Use RTL-appropriate formatting
- Adapt number formats to target locale

Return ONLY a valid JSON object. No markdown, no explanation.`;

    const userPrompt = `Translate these texts from ${sourceLanguage} to: ${languageList}

Texts:
${itemsList}

Return JSON in this exact format:
{
  "0": { "ar": "...", "fr": "...", ... },
  "1": { "ar": "...", "fr": "...", ... },
  ...
}

Use the index numbers [0], [1], etc. as keys.`;

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
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI translation failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      console.error("Empty AI response:", aiResponse);
      return new Response(
        JSON.stringify({ error: "AI returned empty response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse response
    let indexedResults: Record<string, Record<string, string>>;
    try {
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) cleanContent = cleanContent.slice(7);
      if (cleanContent.startsWith("```")) cleanContent = cleanContent.slice(3);
      if (cleanContent.endsWith("```")) cleanContent = cleanContent.slice(0, -3);
      cleanContent = cleanContent.trim();
      
      indexedResults = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content, parseError);
      return new Response(
        JSON.stringify({ error: "Failed to parse translation response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map indexed results back to original keys
    const results: Record<string, Record<string, string>> = {};
    const failedKeys: string[] = [];

    for (let i = 0; i < batchItems.length; i++) {
      const item = batchItems[i];
      const translations = indexedResults[String(i)];
      
      if (translations && typeof translations === 'object') {
        results[item.key] = translations;
      } else {
        failedKeys.push(item.key);
      }
    }

    console.log(`Successfully translated ${Object.keys(results).length} items, ${failedKeys.length} failed`);

    const result: BatchTranslationResponse = { 
      results,
      failedKeys: failedKeys.length > 0 ? failedKeys : undefined,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Batch translation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
