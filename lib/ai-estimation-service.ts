// AI-powered audit estimation service using GPT-5

export interface AuditEstimation {
  complexity: "Simple" | "Medium" | "Complex"
  duration: string
  durationDays: number
  price: number
  minimumPrice: number
  reasoning: string
  riskFactors: string[]
  recommendations: string[]
}

/**
 * Call GPT-5 to analyze smart contract and estimate audit requirements
 */
export async function estimateAuditWithAI(
  repoUrl: string,
  solidityCode: string,
  totalLines: number,
  fileCount: number,
): Promise<AuditEstimation> {
  try {
    console.log("[v0] Calling GPT-5 for audit estimation...")

    const apiKey = process.env.GPT_API

    if (!apiKey) {
      throw new Error("GPT_API environment variable is not set")
    }

    // Prepare the prompt for GPT-5
    const prompt = `You are a Web3 security expert and smart contract auditor. Analyze the following Solidity smart contract project and provide a detailed audit estimation.

Repository: ${repoUrl}
Total Lines of Code: ${totalLines}
Number of Solidity Files: ${fileCount}

Smart Contract Code Sample:
\`\`\`solidity
${solidityCode.slice(0, 3000)} // First 3000 characters
\`\`\`

Please analyze this smart contract project and provide:
1. Complexity Level (Simple/Medium/Complex)
2. Estimated Audit Duration in days
3. Recommended Audit Price in USD
4. Minimum Acceptable Price in USD
5. Key Risk Factors identified
6. Audit Recommendations

Respond in JSON format:
{
  "complexity": "Simple|Medium|Complex",
  "durationDays": number,
  "price": number,
  "minimumPrice": number,
  "reasoning": "brief explanation",
  "riskFactors": ["factor1", "factor2"],
  "recommendations": ["rec1", "rec2"]
}`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4", // Using GPT-4 as GPT-5 may not be available yet
        messages: [
          {
            role: "system",
            content: "You are an expert Web3 security auditor specializing in Solidity smart contract analysis.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    console.log("[v0] GPT-5 response received")

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response")
    }

    const estimation = JSON.parse(jsonMatch[0])

    // Format duration string
    const durationDays = estimation.durationDays
    let duration = ""
    if (durationDays <= 2) duration = "1-2 days"
    else if (durationDays <= 5) duration = "3-5 days"
    else if (durationDays <= 10) duration = "7-10 days"
    else duration = `${durationDays} days`

    return {
      complexity: estimation.complexity,
      duration,
      durationDays,
      price: estimation.price,
      minimumPrice: estimation.minimumPrice,
      reasoning: estimation.reasoning,
      riskFactors: estimation.riskFactors || [],
      recommendations: estimation.recommendations || [],
    }
  } catch (error) {
    console.error("[v0] Error in AI estimation:", error)

    // Fallback to basic estimation based on lines of code
    return getFallbackEstimation(totalLines, fileCount)
  }
}

/**
 * Fallback estimation when AI is unavailable
 */
function getFallbackEstimation(totalLines: number, fileCount: number): AuditEstimation {
  let complexity: "Simple" | "Medium" | "Complex" = "Simple"
  let durationDays = 2
  let price = 50
  let minimumPrice = 40

  if (totalLines > 500 && totalLines <= 2000) {
    complexity = "Medium"
    durationDays = 5
    price = 75
    minimumPrice = 60
  } else if (totalLines > 2000) {
    complexity = "Complex"
    durationDays = 10
    price = 110
    minimumPrice = 90
  }

  return {
    complexity,
    duration: durationDays <= 2 ? "1-2 days" : durationDays <= 5 ? "3-5 days" : "7-10 days",
    durationDays,
    price,
    minimumPrice,
    reasoning: "Estimation based on code complexity and file count",
    riskFactors: ["Automated analysis only", "Manual review recommended"],
    recommendations: ["Comprehensive security audit", "Gas optimization review"],
  }
}
