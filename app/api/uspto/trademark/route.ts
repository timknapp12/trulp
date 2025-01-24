import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

async function analyzeImage(base64Image: string) {
  const visionApiEndpoint = 'https://vision.googleapis.com/v1/images:annotate';
  const apiKey = process.env.GOOGLE_CLOUD_API_KEY;

  const response = await fetch(`${visionApiEndpoint}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [
        {
          image: { content: base64Image.split(',')[1] },
          features: [
            { type: 'LOGO_DETECTION', maxResults: 5 },
            { type: 'LABEL_DETECTION', maxResults: 5 },
          ],
        },
      ],
    }),
  });

  const data = await response.json();
  return data.responses[0]?.logoAnnotations || [];
}

async function searchUSPTO(logoName: string) {
  const response = await fetch(
    `https://tsdrapi.uspto.gov/ts/cd/casestatus/sn78787878/info`,
    {
      method: 'GET',
      headers: {
        'USPTO-API-KEY': process.env.USPTO_API_KEY || '',
      },
    }
  );

  const xmlText = await response.text();
  const parser = new XMLParser();
  const result = parser.parse(xmlText);

  const trademark =
    result?.TrademarkTransaction?.TrademarkTransactionBody
      ?.TransactionContentBag?.TransactionData?.TrademarkBag?.Trademark;

  if (!trademark) return null;

  return {
    status: trademark.MarkCurrentStatusExternalDescriptionText,
    registrationNumber: trademark.ApplicationNumber?.ApplicationNumberText,
    filingDate: trademark.ApplicationDate,
    owner: trademark.ApplicantBag?.Applicant?.[0]?.Contact?.Name?.EntityName,
    mark: trademark.MarkRepresentation?.MarkReproduction?.WordMarkSpecification
      ?.MarkVerbalElementText,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const detectedLogos = await analyzeImage(body.image);

    const usptoResults = [];
    for (const logo of detectedLogos) {
      if (logo.description) {
        const trademark = await searchUSPTO(logo.description);
        if (trademark) {
          usptoResults.push({
            logoName: logo.description,
            confidence: logo.score,
            trademark,
          });
        }
      }
    }

    return NextResponse.json({
      logoDetection: detectedLogos.map((logo) => ({
        name: logo.description,
        confidence: logo.score,
      })),
      trademarks: usptoResults,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
