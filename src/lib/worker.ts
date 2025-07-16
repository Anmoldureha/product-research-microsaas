import { Worker } from "bullmq";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { db } from "./db";
import { redis } from "./queue";
import { env } from "@/env.mjs";

interface ResearchJobData {
  reportId: string;
  product: string;
  userId: string;
}

// AI Research Pipeline
async function generateProductReport(product: string): Promise<any> {
  try {
    // Generate comprehensive product research using GPT-4o-mini
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Create a comprehensive 8-section product intelligence report for "${product}". 

Return ONLY valid JSON with these exact sections:
1. "executive_summary": Brief 2-3 line overview
2. "product_overview": Key features, specifications, price range
3. "market_position": Brand reputation, market share, positioning
4. "customer_sentiment": Overall user satisfaction, common complaints/praise
5. "competitive_analysis": Top 3 competitors and how this product compares
6. "technical_specs": Detailed specifications and technical details
7. "pricing_analysis": Price trends, value proposition, alternatives
8. "recommendation": Final verdict with pros/cons and who should buy it

Make it comprehensive, source-backed (mention review sources), and actionable. Focus on factual information.`,
      maxTokens: 2000,
    });

    return JSON.parse(text);
  } catch (error) {
    console.error("AI generation error:", error);
    
    // Fallback response if AI fails
    return {
      executive_summary: `Analysis for ${product}`,
      product_overview: "Product information being processed...",
      market_position: "Market analysis pending...",
      customer_sentiment: "Customer reviews being analyzed...",
      competitive_analysis: "Competitive landscape under review...",
      technical_specs: "Technical specifications being compiled...",
      pricing_analysis: "Pricing data being gathered...",
      recommendation: "Recommendation will be available shortly...",
      error: "Full analysis temporarily unavailable. Please try again later.",
    };
  }
}

// Background Worker
const researchWorker = new Worker(
  "research",
  async (job) => {
    const { reportId, product, userId }: ResearchJobData = job.data;

    try {
      console.log(`Starting research for product: ${product} (Report: ${reportId})`);

      // Update progress
      await job.updateProgress(25);

      // Generate AI report
      const reportData = await generateProductReport(product);
      
      await job.updateProgress(75);

      // Save to database
      await db.report.update({
        where: { id: reportId },
        data: { jsonData: reportData },
      });

      await job.updateProgress(100);

      console.log(`Research completed for ${product}`);

      // TODO: Send email notification via Resend
      // await sendReportReadyEmail(userId, product, reportId);

      return { success: true, reportId };
    } catch (error) {
      console.error(`Research failed for ${product}:`, error);
      
      // Update report with error state
      await db.report.update({
        where: { id: reportId },
        data: { 
          jsonData: { 
            error: "Research failed. Please try again later.",
            product,
            timestamp: new Date().toISOString(),
          } 
        },
      });

      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 3,
    limiter: {
      max: 10,
      duration: 60000, // 10 jobs per minute
    },
  }
);

researchWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

researchWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

researchWorker.on("error", (err) => {
  console.error("Worker error:", err);
});

export default researchWorker;

// For manual testing
if (require.main === module) {
  console.log("Research worker started...");
  
  process.on("SIGINT", async () => {
    console.log("Shutting down worker...");
    await researchWorker.close();
    process.exit(0);
  });
}