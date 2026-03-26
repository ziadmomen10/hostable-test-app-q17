import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get('ALLOWED_ORIGIN') ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SEOToolRequest {
  action: 
    | "generate_meta" 
    | "generate_faq" 
    | "optimize_voice" 
    | "build_entity" 
    | "enrich_facts" 
    | "suggest_keywords"
    | "suggest_internal_links"
    | "rewrite_content"
    | "generate_alt_text"
    | "generate_all"
    | "generate_content_brief"
    | "optimize_ai_citation"
    | "analyze_llm_visibility"
    | "optimize_answer_box"
    | "generate_refresh_suggestions"
    | "suggest_topic_clusters";
  pageId?: string;
  languageCode?: string;
  content?: string;
  context?: {
    pageTitle?: string;
    pageUrl?: string;
    focusKeyword?: string;
    mode?: string;
    imageUrl?: string;
    currentMeta?: { title?: string; description?: string };
    entityData?: {
      type: "Organization" | "Person";
      name?: string;
      url?: string;
      socialLinks?: string[];
    };
    availablePages?: Array<{ id: string; title: string; url: string; description?: string }>;
    pages?: Array<{ id: string; title: string; url: string; description?: string }>;
  };
}

// In-memory cache for provider setting (avoid DB read every request)
let cachedProvider: { value: string; fetchedAt: number } | null = null;
const PROVIDER_CACHE_TTL = 60_000; // 60 seconds

async function getAIProvider(): Promise<string> {
  if (cachedProvider && Date.now() - cachedProvider.fetchedAt < PROVIDER_CACHE_TTL) {
    return cachedProvider.value;
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data } = await supabaseAdmin
      .from("admin_config")
      .select("value")
      .eq("key", "seo_ai_provider")
      .maybeSingle();

    const provider = data?.value || "openai";
    cachedProvider = { value: provider, fetchedAt: Date.now() };
    return provider;
  } catch (err) {
    console.error("[seo-ai-tools] Failed to read provider config:", err);
    return cachedProvider?.value || "openai";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const provider = await getAIProvider();
    console.log(`[seo-ai-tools] Using provider: ${provider}`);

    // Validate we have the required API key for the chosen provider
    let apiKey: string;
    if (provider === "lovable") {
      apiKey = Deno.env.get("LOVABLE_API_KEY") || "";
      if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured. Set it in Supabase Edge Function secrets.");
    } else if (provider === "claude") {
      apiKey = Deno.env.get("ANTHROPIC_API_KEY") || "";
      if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured. Set it in Supabase Edge Function secrets.");
    } else {
      apiKey = Deno.env.get("OPENAI_API_KEY") || "";
      if (!apiKey) throw new Error("OPENAI_API_KEY is not configured. Set it in Supabase Edge Function secrets.");
    }

    const request: SEOToolRequest = await req.json();
    const { action, content = "", context = {}, languageCode = "en" } = request;

    console.log(`[seo-ai-tools] Action: ${action}, Language: ${languageCode}`);

    let result: any;

    switch (action) {
      case "generate_meta":
        result = await generateMeta(apiKey, provider, content, context, languageCode);
        break;
      case "generate_faq":
        result = await generateFAQ(apiKey, provider, content, context, languageCode);
        break;
      case "optimize_voice":
        result = await optimizeVoice(apiKey, provider, content, context, languageCode);
        break;
      case "build_entity":
        result = await buildEntity(apiKey, provider, context.entityData, languageCode);
        break;
      case "enrich_facts":
        result = await enrichFacts(apiKey, provider, content, context, languageCode);
        break;
      case "suggest_keywords":
        result = await suggestKeywords(apiKey, provider, content, context, languageCode);
        break;
      case "suggest_internal_links":
        result = await suggestInternalLinks(apiKey, provider, content, context, languageCode);
        break;
      case "rewrite_content":
        result = await rewriteContent(apiKey, provider, content, context, languageCode);
        break;
      case "generate_alt_text":
        result = await generateAltText(apiKey, provider, context, languageCode);
        break;
      case "generate_all":
        result = await generateAll(apiKey, provider, content, context, languageCode);
        break;
      case "generate_content_brief":
        result = await generateContentBrief(apiKey, provider, content, context, languageCode);
        break;
      case "optimize_ai_citation":
        result = await optimizeAICitation(apiKey, provider, content, context, languageCode);
        break;
      case "analyze_llm_visibility":
        result = await analyzeLLMVisibility(apiKey, provider, content, context, languageCode);
        break;
      case "optimize_answer_box":
        result = await optimizeAnswerBox(apiKey, provider, content, context, languageCode);
        break;
      case "generate_refresh_suggestions":
        result = await generateRefreshSuggestions(apiKey, provider, content, context, languageCode);
        break;
      case "suggest_topic_clusters":
        result = await suggestTopicClusters(apiKey, provider, context.pages || [], languageCode);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log(`[seo-ai-tools] Success for action: ${action}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[seo-ai-tools] Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const status = errorMessage.includes("Rate limit") ? 429 : 
                   errorMessage.includes("Payment") ? 402 : 500;
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// Unified AI call - routes to the configured provider
async function callAI(apiKey: string, provider: string, systemPrompt: string, userPrompt: string, tools?: any[], toolChoice?: any) {
  if (provider === "openai") {
    return callOpenAI(apiKey, systemPrompt, userPrompt, tools, toolChoice);
  } else if (provider === "claude") {
    return callClaude(apiKey, systemPrompt, userPrompt, tools, toolChoice);
  } else {
    return callLovable(apiKey, systemPrompt, userPrompt, tools, toolChoice);
  }
}

// Claude/Anthropic provider
async function callClaude(apiKey: string, systemPrompt: string, userPrompt: string, tools?: any[], toolChoice?: any) {
  // Anthropic Messages API with tool_use
  const body: any = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      { role: "user", content: userPrompt }
    ],
  };

  if (tools && tools.length > 0) {
    // Convert OpenAI tool format to Anthropic tool format
    body.tools = tools.map((t: any) => ({
      name: t.function.name,
      description: t.function.description,
      input_schema: t.function.parameters,
    }));
    if (toolChoice) {
      body.tool_choice = { type: "tool", name: toolChoice.function.name };
    }
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Claude API Error:", response.status, text);
    if (response.status === 429) throw new Error("Rate limit exceeded. Please try again later.");
    if (response.status === 401) throw new Error("Invalid Anthropic API key. Check your key in Supabase secrets.");
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  console.log("[seo-ai-tools] Claude call successful");

  // Convert Anthropic response to OpenAI-compatible format for uniform handling
  const toolUseBlock = data.content?.find((b: any) => b.type === "tool_use");
  if (toolUseBlock) {
    return {
      choices: [{
        message: {
          tool_calls: [{
            function: {
              name: toolUseBlock.name,
              arguments: JSON.stringify(toolUseBlock.input),
            }
          }]
        }
      }]
    };
  }

  // If no tool use, return text content in OpenAI-compatible format
  const textBlock = data.content?.find((b: any) => b.type === "text");
  return {
    choices: [{
      message: {
        content: textBlock?.text || "",
      }
    }]
  };
}

// OpenAI provider
async function callOpenAI(apiKey: string, systemPrompt: string, userPrompt: string, tools?: any[], toolChoice?: any) {
  const body: any = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
  };

  if (tools) {
    body.tools = tools;
    body.tool_choice = toolChoice;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("OpenAI API Error:", response.status, text);
    if (response.status === 429) throw new Error("Rate limit exceeded. Please try again later.");
    if (response.status === 401) throw new Error("Invalid OpenAI API key. Check your key in Supabase secrets.");
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  console.log("[seo-ai-tools] OpenAI call successful");
  return response.json();
}

// Lovable AI provider
async function callLovable(apiKey: string, systemPrompt: string, userPrompt: string, tools?: any[], toolChoice?: any) {
  const body: any = {
    model: "google/gemini-2.5-flash",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
  };

  if (tools) {
    body.tools = tools;
    body.tool_choice = toolChoice;
  }

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Lovable AI Error:", response.status, text);
    if (response.status === 402) throw new Error("Lovable AI credits exhausted. Switch to OpenAI in System Settings or add credits.");
    if (response.status === 429) throw new Error("Rate limit exceeded. Please try again later.");
    throw new Error(`Lovable AI error: ${response.status}`);
  }

  console.log("[seo-ai-tools] Lovable AI call successful");
  return response.json();
}

// ============================================================
// Action handlers - all now take provider as 2nd arg
// ============================================================

async function generateMeta(apiKey: string, provider: string, content: string, context: any, languageCode: string) {
  const systemPrompt = `You are an expert SEO specialist. Generate optimal meta title and description.
Language: ${languageCode}
Guidelines:
- Title: 30-60 characters, include main keyword, compelling and click-worthy
- Description: 120-160 characters, summarize value proposition, include call-to-action
- Match the content's tone and purpose
- Optimize for both search engines and users`;

  const userPrompt = `Generate meta title and description for this content:

Page Title: ${context.pageTitle || "Unknown"}
URL: ${context.pageUrl || "Unknown"}
Focus Keyword: ${context.focusKeyword || "Not specified"}

Content:
${content.substring(0, 3000)}`;

  const tools = [{
    type: "function",
    function: {
      name: "generate_meta",
      description: "Generate SEO meta title and description",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Meta title (30-60 chars)" },
          description: { type: "string", description: "Meta description (120-160 chars)" },
          titleCharCount: { type: "number" },
          descriptionCharCount: { type: "number" },
          reasoning: { type: "string", description: "Brief explanation of choices" }
        },
        required: ["title", "description", "titleCharCount", "descriptionCharCount"],
        additionalProperties: false
      }
    }
  }];

  const response = await callAI(apiKey, provider, systemPrompt, userPrompt, tools, { type: "function", function: { name: "generate_meta" } });
  const toolCall = response.choices?.[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.arguments) return JSON.parse(toolCall.function.arguments);
  throw new Error("Failed to generate meta data");
}

async function generateFAQ(apiKey: string, provider: string, content: string, context: any, languageCode: string) {
  const systemPrompt = `You are an expert in FAQ schema generation and SEO.
Language: ${languageCode}
Generate 3-5 FAQ questions and answers based on the content.
Questions should be what users commonly search for.
Answers should be concise (40-100 words), direct, and valuable.`;

  const userPrompt = `Generate FAQ schema questions and answers from this content:

Page Title: ${context.pageTitle || "Unknown"}
Focus Keyword: ${context.focusKeyword || "Not specified"}

Content:
${content.substring(0, 4000)}`;

  const tools = [{
    type: "function",
    function: {
      name: "generate_faq",
      description: "Generate FAQ schema questions and answers",
      parameters: {
        type: "object",
        properties: {
          faqs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                answer: { type: "string" }
              },
              required: ["question", "answer"],
              additionalProperties: false
            }
          },
          schema: { type: "object", description: "Complete FAQPage JSON-LD schema" }
        },
        required: ["faqs", "schema"],
        additionalProperties: false
      }
    }
  }];

  const response = await callAI(apiKey, provider, systemPrompt, userPrompt, tools, { type: "function", function: { name: "generate_faq" } });
  const toolCall = response.choices?.[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.arguments) {
    const result = JSON.parse(toolCall.function.arguments);
    result.schema = result.schema || {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": result.faqs.map((faq: any) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
      }))
    };
    return result;
  }
  throw new Error("Failed to generate FAQ");
}

async function optimizeVoice(apiKey: string, provider: string, content: string, context: any, languageCode: string) {
  const systemPrompt = `You are an expert in voice search optimization.
Language: ${languageCode}
Analyze content and provide voice search optimizations:
1. Identify key passages that could be featured snippets
2. Rewrite in natural, conversational language
3. Add question-based headers
4. Create concise, direct answers`;

  const userPrompt = `Optimize this content for voice search:

Page Title: ${context.pageTitle || "Unknown"}
Focus Keyword: ${context.focusKeyword || "Not specified"}

Content:
${content.substring(0, 3000)}`;

  const tools = [{
    type: "function",
    function: {
      name: "optimize_voice",
      description: "Provide voice search optimizations",
      parameters: {
        type: "object",
        properties: {
          featuredSnippet: {
            type: "object",
            properties: {
              question: { type: "string" },
              answer: { type: "string", description: "40-60 word direct answer" },
              type: { type: "string", enum: ["paragraph", "list", "table"] }
            },
            required: ["question", "answer", "type"],
            additionalProperties: false
          },
          conversationalRewrites: {
            type: "array",
            items: {
              type: "object",
              properties: {
                original: { type: "string" },
                rewritten: { type: "string" },
                improvement: { type: "string" }
              },
              required: ["original", "rewritten", "improvement"],
              additionalProperties: false
            }
          },
          suggestedQuestions: { type: "array", items: { type: "string" } }
        },
        required: ["featuredSnippet", "conversationalRewrites", "suggestedQuestions"],
        additionalProperties: false
      }
    }
  }];

  const response = await callAI(apiKey, provider, systemPrompt, userPrompt, tools, { type: "function", function: { name: "optimize_voice" } });
  const toolCall = response.choices?.[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.arguments) return JSON.parse(toolCall.function.arguments);
  throw new Error("Failed to optimize for voice search");
}

async function buildEntity(apiKey: string, provider: string, entityData: any, languageCode: string) {
  const systemPrompt = `You are an expert in schema.org structured data and entity authority.
Language: ${languageCode}
Generate comprehensive Organization or Person schema with:
1. Complete entity information
2. sameAs links to authoritative profiles
3. Brand schema if applicable
4. Proper knowledge graph optimization`;

  const userPrompt = `Build entity authority schema for:

Type: ${entityData?.type || "Organization"}
Name: ${entityData?.name || "Unknown"}
URL: ${entityData?.url || "Unknown"}
Social Links: ${entityData?.socialLinks?.join(", ") || "None provided"}

Generate comprehensive JSON-LD schema.`;

  const tools = [{
    type: "function",
    function: {
      name: "build_entity",
      description: "Generate entity authority schema",
      parameters: {
        type: "object",
        properties: {
          schema: { type: "object", description: "Complete JSON-LD schema for the entity" },
          suggestions: { type: "array", items: { type: "string" }, description: "Suggestions to improve entity authority" },
          missingElements: { type: "array", items: { type: "string" }, description: "Important schema elements that are missing" }
        },
        required: ["schema", "suggestions", "missingElements"],
        additionalProperties: false
      }
    }
  }];

  const response = await callAI(apiKey, provider, systemPrompt, userPrompt, tools, { type: "function", function: { name: "build_entity" } });
  const toolCall = response.choices?.[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.arguments) return JSON.parse(toolCall.function.arguments);
  throw new Error("Failed to build entity schema");
}

async function enrichFacts(apiKey: string, provider: string, content: string, context: any, languageCode: string) {
  const systemPrompt = `You are an expert in content enrichment for AI citability.
Language: ${languageCode}
Analyze content and suggest:
1. Statistics and data points that could be added
2. Research citations that would improve credibility
3. Fact-rich statements that AI would likely cite
4. Ways to make content more authoritative`;

  const userPrompt = `Suggest fact enrichments for this content:

Page Title: ${context.pageTitle || "Unknown"}
Topic: ${context.focusKeyword || "General"}

Content:
${content.substring(0, 3000)}`;

  const tools = [{
    type: "function",
    function: {
      name: "enrich_facts",
      description: "Suggest fact enrichments for AI citability",
      parameters: {
        type: "object",
        properties: {
          suggestions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["statistic", "research", "definition", "comparison", "example"] },
                suggestion: { type: "string" },
                placement: { type: "string" },
                citabilityImpact: { type: "string", enum: ["high", "medium", "low"] }
              },
              required: ["type", "suggestion", "placement", "citabilityImpact"],
              additionalProperties: false
            }
          },
          currentFactDensity: { type: "string", enum: ["low", "medium", "high"] },
          overallRecommendation: { type: "string" }
        },
        required: ["suggestions", "currentFactDensity", "overallRecommendation"],
        additionalProperties: false
      }
    }
  }];

  const response = await callAI(apiKey, provider, systemPrompt, userPrompt, tools, { type: "function", function: { name: "enrich_facts" } });
  const toolCall = response.choices?.[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.arguments) return JSON.parse(toolCall.function.arguments);
  throw new Error("Failed to enrich facts");
}

async function suggestKeywords(apiKey: string, provider: string, content: string, context: any, languageCode: string) {
  const systemPrompt = `You are an expert SEO keyword researcher.
Language: ${languageCode}
Analyze content and suggest:
1. LSI (Latent Semantic Indexing) keywords
2. Related long-tail keywords
3. Question-based keywords
4. Keyword placement recommendations`;

  const userPrompt = `Suggest keywords for this content:

Page Title: ${context.pageTitle || "Unknown"}
Current Focus Keyword: ${context.focusKeyword || "Not set"}
URL: ${context.pageUrl || "Unknown"}

Content:
${content.substring(0, 3000)}`;

  const tools = [{
    type: "function",
    function: {
      name: "suggest_keywords",
      description: "Suggest keywords and placements",
      parameters: {
        type: "object",
        properties: {
          primaryKeyword: {
            type: "object",
            properties: {
              keyword: { type: "string" },
              reasoning: { type: "string" }
            },
            required: ["keyword", "reasoning"],
            additionalProperties: false
          },
          secondaryKeywords: {
            type: "array",
            items: {
              type: "object",
              properties: {
                keyword: { type: "string" },
                type: { type: "string", enum: ["lsi", "long-tail", "question", "related"] },
                usage: { type: "string" }
              },
              required: ["keyword", "type", "usage"],
              additionalProperties: false
            }
          },
          placementMatrix: {
            type: "object",
            properties: {
              title: { type: "boolean" },
              h1: { type: "boolean" },
              h2: { type: "boolean" },
              firstParagraph: { type: "boolean" },
              url: { type: "boolean" },
              metaDescription: { type: "boolean" }
            },
            required: ["title", "h1", "h2", "firstParagraph", "url", "metaDescription"],
            additionalProperties: false
          }
        },
        required: ["primaryKeyword", "secondaryKeywords", "placementMatrix"],
        additionalProperties: false
      }
    }
  }];

  const response = await callAI(apiKey, provider, systemPrompt, userPrompt, tools, { type: "function", function: { name: "suggest_keywords" } });
  const toolCall = response.choices?.[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.arguments) return JSON.parse(toolCall.function.arguments);
  throw new Error("Failed to suggest keywords");
}

async function suggestInternalLinks(apiKey: string, provider: string, content: string, context: any, languageCode: string) {
  const availablePages = context.availablePages || [];
  if (availablePages.length === 0) return { suggestions: [] };

  const systemPrompt = `You are an SEO specialist focused on internal linking strategy.
Language: ${languageCode}
Analyze the content and available pages to suggest internal linking opportunities.`;

  const userPrompt = `Content to analyze:
${content.substring(0, 2000)}

Current page URL: ${context.pageUrl || "Unknown"}
Focus keyword: ${context.focusKeyword || "None"}

Available pages to link to:
${availablePages.slice(0, 20).map((p: any) => `- ${p.title} (${p.url}): ${p.description || 'No description'}`).join('\n')}`;

  const tools = [{
    type: "function",
    function: {
      name: "suggest_internal_links",
      description: "Suggest internal linking opportunities",
      parameters: {
        type: "object",
        properties: {
          suggestions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                targetPageId: { type: "string" },
                targetUrl: { type: "string" },
                targetTitle: { type: "string" },
                anchorText: { type: "string" },
                relevanceScore: { type: "string", enum: ["high", "medium", "low"] },
                reason: { type: "string" }
              },
              required: ["targetUrl", "targetTitle", "anchorText", "relevanceScore", "reason"],
              additionalProperties: false
            }
          }
        },
        required: ["suggestions"],
        additionalProperties: false
      }
    }
  }];

  const response = await callAI(apiKey, provider, systemPrompt, userPrompt, tools, { type: "function", function: { name: "suggest_internal_links" } });
  const toolCall = response.choices?.[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.arguments) return JSON.parse(toolCall.function.arguments);
  throw new Error("Failed to suggest internal links");
}

async function rewriteContent(apiKey: string, provider: string, content: string, context: any, languageCode: string) {
  const mode = context.mode || 'seo';
  const modeInstructions: Record<string, string> = {
    seo: `Optimize for search engines:\n- Naturally incorporate keywords\n- Improve structure and flow\n- Add semantic variations\n- Maintain readability`,
    voice: `Optimize for voice search:\n- Use conversational language\n- Add question-based phrasing\n- Keep sentences short and natural`,
    ai: `Optimize for AI citations:\n- Add specific facts and statistics\n- Include definitive statements\n- Use clear, citable phrasing`
  };

  const systemPrompt = `You are an expert content optimizer.
Language: ${languageCode}
Mode: ${mode}

${modeInstructions[mode] || modeInstructions.seo}

Rewrite the provided text while preserving its meaning. Return ONLY the rewritten text.`;

  const userPrompt = `Rewrite this content for ${mode} optimization:

Focus Keyword: ${context.focusKeyword || 'Not specified'}

Content to rewrite:
${content}`;

  const response = await callAI(apiKey, provider, systemPrompt, userPrompt);
  const rewritten = response.choices?.[0]?.message?.content?.trim();
  if (!rewritten) throw new Error("Failed to rewrite content");
  return { rewritten, mode };
}

async function generateAltText(apiKey: string, provider: string, context: any, languageCode: string) {
  const systemPrompt = `You are an accessibility and SEO expert.
Language: ${languageCode}
Generate descriptive alt text for images that:
- Accurately describes the image content
- Is concise (under 125 characters)
- Includes relevant keywords when natural
- Follows accessibility best practices`;

  const userPrompt = `Generate alt text for an image from this page:

Page Title: ${context.pageTitle || 'Unknown'}
Page Topic: ${context.focusKeyword || 'General'}
Image URL: ${context.imageUrl || 'Unknown'}

Provide a concise, descriptive alt text.`;

  const tools = [{
    type: "function",
    function: {
      name: "generate_alt_text",
      description: "Generate SEO-friendly alt text for an image",
      parameters: {
        type: "object",
        properties: {
          altText: { type: "string", description: "Alt text (under 125 chars)" },
          reasoning: { type: "string", description: "Brief explanation" }
        },
        required: ["altText"],
        additionalProperties: false
      }
    }
  }];

  const response = await callAI(apiKey, provider, systemPrompt, userPrompt, tools, { type: "function", function: { name: "generate_alt_text" } });
  const toolCall = response.choices?.[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.arguments) return JSON.parse(toolCall.function.arguments);
  throw new Error("Failed to generate alt text");
}

async function generateAll(apiKey: string, provider: string, content: string, context: any, languageCode: string) {
  const [metaResult, keywordResult] = await Promise.all([
    generateMeta(apiKey, provider, content, context, languageCode),
    suggestKeywords(apiKey, provider, content, context, languageCode)
  ]);
  return { meta: metaResult, keywords: keywordResult };
}

async function generateContentBrief(apiKey: string, provider: string, content: string, context: any, languageCode: string) {
  const systemPrompt = `You are an expert content strategist and SEO specialist.
Language: ${languageCode}
Generate a comprehensive content brief including:
1. Target word count based on topic complexity
2. H1/H2/H3 heading structure
3. Questions users would want answered
4. Semantic keywords with search intent`;

  const userPrompt = `Generate a content brief for this page:

Page Title: ${context.pageTitle || "Unknown"}
URL: ${context.pageUrl || "Unknown"}
Focus Keyword: ${context.focusKeyword || "Not specified"}

Current Content:
${content.substring(0, 3000)}`;

  const tools = [{
    type: "function",
    function: {
      name: "generate_content_brief",
      description: "Generate comprehensive content brief",
      parameters: {
        type: "object",
        properties: {
          targetWordCount: { type: "number" },
          headingStructure: {
            type: "array",
            items: {
              type: "object",
              properties: {
                level: { type: "string", enum: ["h1", "h2", "h3"] },
                text: { type: "string" }
              },
              required: ["level", "text"],
              additionalProperties: false
            }
          },
          questionsToAnswer: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                searchIntent: { type: "string", enum: ["informational", "navigational", "transactional", "commercial"] },
                priority: { type: "string", enum: ["high", "medium", "low"] }
              },
              required: ["question", "searchIntent", "priority"],
              additionalProperties: false
            }
          },
          semanticKeywords: {
            type: "array",
            items: {
              type: "object",
              properties: {
                keyword: { type: "string" },
                type: { type: "string", enum: ["lsi", "long-tail", "question", "related"] },
                searchIntent: { type: "string", enum: ["informational", "navigational", "transactional", "commercial"] },
                difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
                usage: { type: "string" }
              },
              required: ["keyword", "type", "searchIntent", "difficulty", "usage"],
              additionalProperties: false
            }
          },
          competitorInsights: { type: "string" }
        },
        required: ["targetWordCount", "headingStructure", "questionsToAnswer", "semanticKeywords"],
        additionalProperties: false
      }
    }
  }];

  const response = await callAI(apiKey, provider, systemPrompt, userPrompt, tools, { type: "function", function: { name: "generate_content_brief" } });
  const toolCall = response.choices?.[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.arguments) return JSON.parse(toolCall.function.arguments);
  throw new Error("Failed to generate content brief");
}

async function optimizeAICitation(apiKey: string, provider: string, content: string, context: any, languageCode: string) {
  const systemPrompt = `You are an expert in AI engine optimization (GEO/AEO).
Language: ${languageCode}
Analyze content and generate optimizations for AI citations.`;

  const userPrompt = `Optimize this content for AI engine citations:

Page Title: ${context.pageTitle || "Unknown"}
Topic: ${context.focusKeyword || "General"}

Content:
${content.substring(0, 3000)}`;

  const tools = [{
    type: "function",
    function: {
      name: "optimize_ai_citation",
      description: "Generate AI-citable content optimizations",
      parameters: {
        type: "object",
        properties: {
          citableSnippets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                snippet: { type: "string" },
                type: { type: "string", enum: ["definition", "statistic", "fact", "quote", "comparison"] },
                citabilityScore: { type: "number" }
              },
              required: ["snippet", "type", "citabilityScore"],
              additionalProperties: false
            }
          },
          statisticSuggestions: { type: "array", items: { type: "string" } },
          overallCitabilityScore: { type: "number" },
          recommendations: { type: "array", items: { type: "string" } }
        },
        required: ["citableSnippets", "overallCitabilityScore", "recommendations"],
        additionalProperties: false
      }
    }
  }];

  const response = await callAI(apiKey, provider, systemPrompt, userPrompt, tools, { type: "function", function: { name: "optimize_ai_citation" } });
  const toolCall = response.choices?.[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.arguments) return JSON.parse(toolCall.function.arguments);
  throw new Error("Failed to optimize for AI citation");
}

async function analyzeLLMVisibility(apiKey: string, provider: string, content: string, context: any, languageCode: string) {
  const systemPrompt = `You are an AI visibility analyst.
Language: ${languageCode}
Analyze content for likelihood of being cited by AI engines like ChatGPT, Claude, Perplexity.
Score based on: Fact density (20%), Direct answer format (25%), Authority signals (20%), Structured data (15%), Unique insights (20%)`;

  const userPrompt = `Analyze this content for LLM visibility:

Page Title: ${context.pageTitle || "Unknown"}
Topic: ${context.focusKeyword || "General"}

Content:
${content.substring(0, 3000)}`;

  const tools = [{
    type: "function",
    function: {
      name: "analyze_llm_visibility",
      description: "Analyze content for AI visibility",
      parameters: {
        type: "object",
        properties: {
          overallScore: { type: "number" },
          breakdown: {
            type: "object",
            properties: {
              factDensity: { type: "number" },
              directAnswers: { type: "number" },
              authoritySignals: { type: "number" },
              structuredData: { type: "number" },
              uniqueInsights: { type: "number" }
            },
            required: ["factDensity", "directAnswers", "authoritySignals", "structuredData", "uniqueInsights"],
            additionalProperties: false
          },
          strengths: { type: "array", items: { type: "string" } },
          improvements: { type: "array", items: { type: "string" } }
        },
        required: ["overallScore", "breakdown", "strengths", "improvements"],
        additionalProperties: false
      }
    }
  }];

  const response = await callAI(apiKey, provider, systemPrompt, userPrompt, tools, { type: "function", function: { name: "analyze_llm_visibility" } });
  const toolCall = response.choices?.[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.arguments) return JSON.parse(toolCall.function.arguments);
  throw new Error("Failed to analyze LLM visibility");
}

async function optimizeAnswerBox(apiKey: string, provider: string, content: string, context: any, languageCode: string) {
  const systemPrompt = `You are an expert in featured snippet optimization.
Language: ${languageCode}
Generate content optimized for featured snippets and answer boxes in multiple formats.`;

  const userPrompt = `Generate answer box optimized content for:

Page Title: ${context.pageTitle || "Unknown"}
Focus Keyword: ${context.focusKeyword || "Not specified"}

Content:
${content.substring(0, 3000)}`;

  const tools = [{
    type: "function",
    function: {
      name: "optimize_answer_box",
      description: "Generate featured snippet formats",
      parameters: {
        type: "object",
        properties: {
          paragraphFormat: {
            type: "object",
            properties: {
              question: { type: "string" },
              answer: { type: "string" }
            },
            required: ["question", "answer"],
            additionalProperties: false
          },
          listFormat: {
            type: "object",
            properties: {
              question: { type: "string" },
              items: { type: "array", items: { type: "string" } },
              listType: { type: "string", enum: ["ordered", "unordered"] }
            },
            required: ["question", "items", "listType"],
            additionalProperties: false
          },
          tableFormat: {
            type: "object",
            properties: {
              question: { type: "string" },
              headers: { type: "array", items: { type: "string" } },
              rows: { type: "array", items: { type: "array", items: { type: "string" } } }
            },
            required: ["question", "headers", "rows"],
            additionalProperties: false
          },
          definitionFormat: {
            type: "object",
            properties: {
              term: { type: "string" },
              definition: { type: "string" }
            },
            required: ["term", "definition"],
            additionalProperties: false
          },
          recommendedFormat: { type: "string", enum: ["paragraph", "list", "table", "definition"] }
        },
        required: ["paragraphFormat", "listFormat", "recommendedFormat"],
        additionalProperties: false
      }
    }
  }];

  const response = await callAI(apiKey, provider, systemPrompt, userPrompt, tools, { type: "function", function: { name: "optimize_answer_box" } });
  const toolCall = response.choices?.[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.arguments) return JSON.parse(toolCall.function.arguments);
  throw new Error("Failed to optimize for answer box");
}

async function generateRefreshSuggestions(apiKey: string, provider: string, content: string, context: any, languageCode: string) {
  const systemPrompt = `You are a content freshness analyst.
Language: ${languageCode}
Analyze potentially stale content and suggest updates.`;

  const userPrompt = `Suggest content refresh actions for this page:

Page Title: ${context.pageTitle || "Unknown"}
Topic: ${context.focusKeyword || "General"}

Content:
${content.substring(0, 3000)}`;

  const tools = [{
    type: "function",
    function: {
      name: "generate_refresh_suggestions",
      description: "Generate content refresh recommendations",
      parameters: {
        type: "object",
        properties: {
          urgency: { type: "string", enum: ["low", "medium", "high", "critical"] },
          outdatedElements: {
            type: "array",
            items: {
              type: "object",
              properties: {
                element: { type: "string" },
                issue: { type: "string" },
                suggestion: { type: "string" }
              },
              required: ["element", "issue", "suggestion"],
              additionalProperties: false
            }
          },
          newSections: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                priority: { type: "string", enum: ["low", "medium", "high"] }
              },
              required: ["title", "description", "priority"],
              additionalProperties: false
            }
          },
          competitorGaps: { type: "array", items: { type: "string" } },
          overallRecommendation: { type: "string" }
        },
        required: ["urgency", "outdatedElements", "newSections", "overallRecommendation"],
        additionalProperties: false
      }
    }
  }];

  const response = await callAI(apiKey, provider, systemPrompt, userPrompt, tools, { type: "function", function: { name: "generate_refresh_suggestions" } });
  const toolCall = response.choices?.[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.arguments) return JSON.parse(toolCall.function.arguments);
  throw new Error("Failed to generate refresh suggestions");
}

async function suggestTopicClusters(
  apiKey: string,
  provider: string,
  pages: Array<{ id: string; title: string; url: string; description?: string }>,
  languageCode: string
) {
  if (!pages || pages.length === 0) return { clusters: [] };

  const systemPrompt = `You are an SEO content strategist specializing in topic clustering.
Language: ${languageCode}
Analyze the provided pages and group them into 3-5 topical clusters.`;

  const userPrompt = `Analyze these pages and suggest topic clusters:

${pages.slice(0, 30).map((p, i) => `${i + 1}. "${p.title}" (${p.url})${p.description ? `: ${p.description}` : ''}`).join('\n')}`;

  const tools = [{
    type: "function",
    function: {
      name: "suggest_topic_clusters",
      description: "Suggest topic clusters from page list",
      parameters: {
        type: "object",
        properties: {
          clusters: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                pillarPageId: { type: "string" },
                pageIds: { type: "array", items: { type: "string" } }
              },
              required: ["name", "description", "pageIds"],
              additionalProperties: false
            }
          }
        },
        required: ["clusters"],
        additionalProperties: false
      }
    }
  }];

  const response = await callAI(apiKey, provider, systemPrompt, userPrompt, tools, { type: "function", function: { name: "suggest_topic_clusters" } });
  const toolCall = response.choices?.[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.arguments) return JSON.parse(toolCall.function.arguments);
  throw new Error("Failed to suggest topic clusters");
}
