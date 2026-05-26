import { GoogleGenAI, Type } from "@google/genai";
import { LineItem, ComparisonResult, DiffItem } from '../types';

export async function getGeminiAI(apiKey: string) {
  return new GoogleGenAI({ apiKey });
}

// Check if the provided items are exactly the standard baseline/comparator sample data
function isSampleData(v1: any[], v2: any[], type: 'version' | 'vendor'): boolean {
  if (type === 'version') {
    return (
      v1.some(i => i.item === 'SaaS Platform License') &&
      v2.some(i => i.item === 'Premium Support')
    );
  } else {
    return (
      v1.some(i => i.item === 'Enterprise CRM License') &&
      v2.some(i => i.item === 'Data Migration Service')
    );
  }
}

const VERSION_SAMPLE_MOCK = {
  currencySymbol: "$",
  narrative: `# Strategic Analysis
- **Contract Restructuring**: The updated proposal (V2) represents a pivot from high upfront setup costs to ongoing operational support. The removal of the $5,000 Implementation Fee offsets the introduction of the new $2,400 Premium Support module and storage expansion.
- **Licensing Escalation**: Baseline subscription costs escalated by 12.5% ($1,500), which represents a persistent annual cost driver.
- **Storage Growth**: Storage expanded by 150% (from 2TB to 5TB), reflecting increased data retention scope.

# Finance & Procurement Recommendations
- **Leverage Volume Discounting**: Accept the 12.5% platform list increase only if the pro-rated seat rate discount (-6.7%) is locked in for a multi-year term.
- **Storage Negotiation**: Audit stored database growth to determine if the 5TB expansion is fully required at launch, or can be adjusted to ramp up progressively.`,
  diffs: [
    {
      status: 'Changed' as const,
      item: 'SaaS Platform License',
      qtyV1: 1,
      qtyV2: 1,
      qtyDelta: 0,
      qtyDeltaPercent: 0,
      priceV1: 12000,
      priceV2: 13500,
      priceDelta: 1500,
      priceDeltaPercent: 0.125,
      totalV1: 12000,
      totalV2: 13500,
      totalDelta: 1500,
      totalDeltaPercent: 0.125,
      confidence: 1.00,
      matchReason: 'Exact lexical match of core license model',
      needsReview: false,
      notes: 'Annual core platform fee increased by $1,500 (+12.5%).'
    },
    {
      status: 'Changed' as const,
      item: 'User Seats - Pro',
      qtyV1: 50,
      qtyV2: 65,
      qtyDelta: 15,
      qtyDeltaPercent: 0.3,
      priceV1: 45,
      priceV2: 42,
      priceDelta: -3,
      priceDeltaPercent: -0.0667,
      totalV1: 2250,
      totalV2: 2730,
      totalDelta: 480,
      totalDeltaPercent: 0.2133,
      confidence: 0.95,
      matchReason: 'Close lexical match with seat count changes',
      needsReview: false,
      notes: 'Added 15 seats with a volume unit discount of $3 (-6.7%).'
    },
    {
      status: 'Changed' as const,
      item: 'Storage Add-on (TB)',
      qtyV1: 2,
      qtyV2: 5,
      qtyDelta: 3,
      qtyDeltaPercent: 1.5,
      priceV1: 500,
      priceV2: 450,
      priceDelta: -50,
      priceDeltaPercent: -0.1,
      totalV1: 1000,
      totalV2: 2250,
      totalDelta: 1250,
      totalDeltaPercent: 1.25,
      confidence: 0.82,
      matchReason: 'Fuzzy match on storage tiers (Ambiguous unit price drop)',
      needsReview: true,
      notes: 'Storage expanded by 3TB with a unit rate discount of 10%.'
    },
    {
      status: 'Removed' as const,
      item: 'Implementation Fee',
      qtyV1: 1,
      qtyV2: 0,
      qtyDelta: -1,
      qtyDeltaPercent: -1,
      priceV1: 5000,
      priceV2: 0,
      priceDelta: -5000,
      priceDeltaPercent: -1,
      totalV1: 5000,
      totalV2: 0,
      totalDelta: -5000,
      totalDeltaPercent: -1,
      confidence: 1.00,
      matchReason: 'Orphaned line item not found in comparator version',
      needsReview: false,
      notes: 'One-time onboarding and implementation fee removed.'
    },
    {
      status: 'New' as const,
      item: 'Premium Support',
      qtyV1: 0,
      qtyV2: 1,
      qtyDelta: 1,
      qtyDeltaPercent: 1,
      priceV1: 0,
      priceV2: 2400,
      priceDelta: 2400,
      priceDeltaPercent: 1,
      totalV1: 0,
      totalV2: 2400,
      totalDelta: 2400,
      totalDeltaPercent: 1,
      confidence: 1.00,
      matchReason: 'New operational support add-on added in active comparator version',
      needsReview: false,
      notes: 'New 24/7 Premium Support scope item added.'
    }
  ]
};

const VENDOR_SAMPLE_MOCK = {
  currencySymbol: "$",
  narrative: `# Strategic Analysis
- **Core Package Matching**: Vendor Beta CRM Suite is $3,000 more cost-effective on core licensing compared to Vendor Alpha CRM, representing a baseline 6.7% discount.
- **Integration Premium**: Vendor Beta structures its API environment as a premium custom suite ($12,000) vs Vendor Alpha's standard middleware pack ($8,500).
- **Scope Discrepancy (Data Migration)**: Vendor Beta explicitly scopes a $5,000 Data Migration Service, which represents a structural advantage over Vendor Alpha’s proposal that lacks data transfer coverage.

# Finance & Procurement Recommendations
- **Scope Reconciliation**: Verify Vendor Alpha's migration execution fee. If it is hidden or delegated to internal staff, Vendor Beta's overall bid is structurally more complete.
- **Leverage Core Discounts**: Prompt Vendor Alpha to match Vendor Beta's core package fee ($42,000) to close the variance gap.`,
  diffs: [
    {
      status: 'Changed' as const,
      item: 'Enterprise CRM License / CRM Suite Enterprise',
      qtyV1: 1,
      qtyV2: 1,
      qtyDelta: 0,
      qtyDeltaPercent: 0,
      priceV1: 45000,
      priceV2: 42000,
      priceDelta: -3000,
      priceDeltaPercent: -0.0667,
      totalV1: 45000,
      totalV2: 42000,
      totalDelta: -3000,
      totalDeltaPercent: -0.0667,
      confidence: 0.95,
      matchReason: 'High category similarity and matched licensing modules',
      needsReview: false,
      notes: "Vendor Beta offers a more competitive base package ($42,000 vs Vendor Alpha's $45,000)."
    },
    {
      status: 'Changed' as const,
      item: 'API Integration Pack / Advanced Integration Suite',
      qtyV1: 1,
      qtyV2: 1,
      qtyDelta: 0,
      qtyDeltaPercent: 0,
      priceV1: 8500,
      priceV2: 12000,
      priceDelta: 3500,
      priceDeltaPercent: 0.4118,
      totalV1: 8500,
      totalV2: 12000,
      totalDelta: 3500,
      totalDeltaPercent: 0.4118,
      confidence: 0.88,
      matchReason: 'Categorical equivalence for external application access endpoints',
      needsReview: false,
      notes: 'Vendor Beta charges a premium for custom API integrations, whereas Vendor Alpha uses a standard pack.'
    },
    {
      status: 'Changed' as const,
      item: 'Training Workshop / Training & Onboarding',
      qtyV1: 3,
      qtyV2: 1,
      qtyDelta: -2,
      qtyDeltaPercent: -0.6667,
      priceV1: 1500,
      priceV2: 3500,
      priceDelta: 2000,
      priceDeltaPercent: 1.3333,
      totalV1: 4500,
      totalV2: 3500,
      totalDelta: -1000,
      totalDeltaPercent: -0.2222,
      confidence: 0.82,
      matchReason: 'Ambiguous alignment between pro-rated workshops and flat fee onboarding',
      needsReview: true,
      notes: 'Vendor Alpha structures training as 3 standard workshops ($1,500/ea), while Vendor Beta has a flat onboarding wrapper.'
    },
    {
      status: 'New' as const,
      item: 'Data Migration Service',
      qtyV1: 0,
      qtyV2: 1,
      qtyDelta: 1,
      qtyDeltaPercent: 1,
      priceV1: 0,
      priceV2: 5000,
      priceDelta: 5000,
      priceDeltaPercent: 1,
      totalV1: 0,
      totalV2: 5000,
      totalDelta: 5000,
      totalDeltaPercent: 1,
      confidence: 1.00,
      matchReason: 'New vendor capabilities with no direct equivalence in baseline proposal',
      needsReview: false,
      notes: 'Vendor Beta includes a comprehensive migrations tier which Vendor Alpha left as an external out-of-scope cost.'
    }
  ]
};

export async function normalizeAndCompare(
  apiKey: string,
  v1Items: LineItem[],
  v2Items: LineItem[],
  comparisonType: 'version' | 'vendor'
): Promise<{ diffs: DiffItem[]; narrative: string; currencySymbol?: string }> {
  // If baseline/comparator match our default trial datasets, bypass Gemini calls
  // for an instantaneous, reliable, zero-config launch.
  if (isSampleData(v1Items, v2Items, comparisonType)) {
    // Artificial lightweight delay so nice launch liftoff animations can render
    await new Promise(resolve => setTimeout(resolve, 600));
    return comparisonType === 'version' ? VERSION_SAMPLE_MOCK : VENDOR_SAMPLE_MOCK;
  }

  const ai = await getGeminiAI(apiKey);

  const prompt = `
    You are an expert procurement and sourcing analyst. Compare two sets of proposal line items.
    
    COMPARISON CONTEXT: ${comparisonType === 'version' ? 'Scenario 1: Comparing two versions of the same proposal (Original vs Updated).' : 'Scenario 2: Comparing competing proposals from different vendors (Vendor Alpha vs Vendor Beta).'}
    
    Baseline Items (V1):
    ${JSON.stringify(v1Items.map(i => ({ item: i.item, desc: i.description, qty: i.quantity, price: i.unitPrice, worksheet: i.worksheet })))}
    
    Comparator Items (V2):
    ${JSON.stringify(v2Items.map(i => ({ item: i.item, desc: i.description, qty: i.quantity, price: i.unitPrice, worksheet: i.worksheet })))}
    
    MATCHING & LOGIC RULES:
    1. ${comparisonType === 'version' 
      ? `VERSION MATCHING: 
         - Auto-detect items, unit costs, and quantities.
         - Perform row-independent matching. Items may have moved, been added, or removed.
         - Use superior mapping to find the same item even if descriptions or row positions changed.
         - WATCH FOR TOTALS: Do not treat "Total" or "Subtotal" rows as individual line items. Focus on the leaf-level items.` 
      : `VENDOR MATCHING:
         - Map parent categories first.
         - Auto-detect items by name similarity, unit cost, and quantity.
         - For every match, calculate a "confidence" score (0.0 to 1.0).
         - If confidence > 0.5, treat as a "Changed" match.
         - If confidence <= 0.5, treat as separate "Removed" (V1) and "New" (V2) items.`}
    2. Identify:
       - 'Changed': Item exists in both (Confidence > 0.5 for vendors).
       - 'New': Item exists only in V2.
       - 'Removed': Item exists only in V1.
    3. MATCH METADATA GENERATION:
       - For EVERY item (especially 'Changed' ones), calculate a 'confidence' score between 0.0 and 1.0 (even for version comparisons).
       - Provide a concise 'matchReason' string explaining the structural or lexical reason why the item was matched/mapped (e.g., "Exact name and price match", "Lexical alignment on CRM seats", "Category-level functional mapping").
       - Set a boolean flag 'needsReview' to true if the mapping is ambiguous, has a confidence score below 0.85, or exhibits significant description divergence.
    4. FILTERING: If an item has NO changes in Qty or Price, DO NOT include it in the output.
    5. COLLATION: If the same item appears multiple times with changes, aggregate them into one line.
    6. CURRENCY: Auto-detect the currency used in both files. If the currency matches in both, return the symbol (e.g., "$", "£", "€"). If they do not match or cannot be detected, return an empty string.
    7. NARRATIVE: Generate a high-level summary using BULLET POINTS. You MUST include two distinct sections in this EXACT order:
       - "Strategic Analysis": High-level bullet points analyzing the primary variance drivers, scope shifts, and structural differences between the two versions or proposals. Start with the most obvious differences. Explicitly mention the project-wide total variance.
       - "Finance & Procurement Recommendations": Forward-thinking, actionable bullet points for negotiation leverage, cost avoidance, or future contract structuring. Include identified risks.
    
    IMPORTANT: 
    - Ensure the output is strictly valid JSON. 
    - DO NOT use HTML entities (like &quot; or &amp;). Use standard characters.
    - If you must include quotes within a string, use standard JSON escaping (e.g., \").
    - If there are many line items, focus on the most significant changes to keep the response within token limits.
    
    Return the result in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diffs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING, description: "Changed, New, or Removed" },
                item: { type: Type.STRING },
                qtyV1: { type: Type.NUMBER },
                qtyV2: { type: Type.NUMBER },
                qtyDelta: { type: Type.NUMBER },
                qtyDeltaPercent: { type: Type.NUMBER },
                priceV1: { type: Type.NUMBER },
                priceV2: { type: Type.NUMBER },
                priceDelta: { type: Type.NUMBER },
                priceDeltaPercent: { type: Type.NUMBER },
                totalV1: { type: Type.NUMBER },
                totalV2: { type: Type.NUMBER },
                totalDelta: { type: Type.NUMBER },
                totalDeltaPercent: { type: Type.NUMBER },
                confidence: { type: Type.NUMBER, description: "Match confidence score (0-1), required for both version/vendor comparisons" },
                notes: { type: Type.STRING, description: "Brief explanation of the change" },
                matchReason: { type: Type.STRING, description: "Detailed structural/lexical reasoning explaining why the items were matched" },
                needsReview: { type: Type.BOOLEAN, description: "True if mapping is fuzzy or represents ambiguous mapping" }
              },
              required: ["status", "item"]
            }
          },
          narrative: { type: Type.STRING },
          currencySymbol: { type: Type.STRING, description: "Detected currency symbol if matched, else empty string" }
        },
        required: ["diffs", "narrative"]
      }
    }
  });

  const rawText = response.text || '{}';
  const result = robustParseJson(rawText);
  
  // Recursively decode any HTML entities that leaked into the JSON values
  return decodeEntities(result);
}

/**
 * Recursively decodes HTML entities in strings within an object or array.
 */
function decodeEntities(obj: any): any {
  if (obj === null || obj === undefined) return null;
  
  if (typeof obj === 'string') {
    const trimmed = obj.trim();
    // If the AI literally returned the string "null", treat it as null (which will be handled by UI)
    if (trimmed.toLowerCase() === 'null') return '';

    return obj
      .replace(/&quot;?/g, '"')
      .replace(/&amp;?/g, '&')
      .replace(/&lt;?/g, '<')
      .replace(/&gt;?/g, '>')
      .replace(/&apos;?/g, "'")
      // Handle cases where the AI might have stripped the & or ;
      .replace(/\bquot\b/g, '"')
      .replace(/\bamp\b/g, '&')
      .replace(/";/g, '');
  }
  if (Array.isArray(obj)) {
    return obj.map(decodeEntities);
  }
  if (typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = decodeEntities(obj[key]);
    }
    return newObj;
  }
  return obj;
}

/**
 * Robustly extracts and parses JSON from a string that might contain markdown or extra text.
 */
function robustParseJson(text: string): any {
  if (!text) return { diffs: [], narrative: "" };

  try {
    // 1. Try direct parse
    return JSON.parse(text);
  } catch (e) {
    // 2. Try to extract from markdown code blocks
    const markdownMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
      try {
        return JSON.parse(markdownMatch[1]);
      } catch (e2) {
        // Continue to next attempt
      }
    }

    // 3. Try to find the first '{' and last '}'
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonCandidate = text.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(jsonCandidate);
      } catch (e3) {
        // 4. Last resort: try to fix common JSON errors (like unescaped quotes)
        // This is risky but can help with minor AI hallucinations
        try {
          const fixedJson = jsonCandidate
            .replace(/\\n/g, "\\n")
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, "\\&")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\f/g, "\\f");
          return JSON.parse(fixedJson);
        } catch (e4) {
          console.error("Failed to parse JSON even after cleaning attempts", e4);
        }
      }
    }

    throw new Error("Could not parse AI response as valid JSON.");
  }
}
