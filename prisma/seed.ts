import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create a test user
  const passwordHash = await hash("password123", {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const testUser = await prisma.user.upsert({
    where: { email: "test@researchpal.pro" },
    update: {},
    create: {
      email: "test@researchpal.pro",
      name: "Test User",
      passwordHash,
      credits: 10,
    },
  });

  console.log(`✅ Created test user: ${testUser.email}`);

  // Create a sample report
  const sampleReport = await prisma.report.upsert({
    where: { id: "sample-report-1" },
    update: {},
    create: {
      id: "sample-report-1",
      userId: testUser.id,
      product: "Sony WH-1000XM5",
      jsonData: {
        executive_summary: "Premium noise-canceling headphones with industry-leading ANC technology and 30-hour battery life.",
        product_overview: "The Sony WH-1000XM5 offers exceptional sound quality with advanced noise cancellation, comfortable design, and smart features like adaptive sound control.",
        market_position: "Sony leads the premium ANC headphone market alongside Bose, positioned as the top choice for audiophiles and frequent travelers.",
        customer_sentiment: "Highly positive reviews (4.4/5 stars) with praise for sound quality and ANC. Common complaints include touch controls and plastic build quality.",
        competitive_analysis: "Main competitors: Bose QuietComfort 45, Apple AirPods Max. Sony excels in ANC and battery life, while competitors offer different design philosophies.",
        technical_specs: "40mm drivers, 20Hz-40kHz frequency response, 30-hour battery, USB-C charging, Bluetooth 5.2, LDAC support, 250g weight.",
        pricing_analysis: "MSRP ₹29,990 ($360), often available for ₹25,000-27,000. Good value for premium features compared to competitors.",
        recommendation: "Highly recommended for users prioritizing sound quality and ANC. Best for: frequent travelers, audiophiles, remote workers. Consider alternatives if you prefer on-ear design."
      }
    },
  });

  console.log(`✅ Created sample report: ${sampleReport.product}`);

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });