import { NextResponse } from 'next/server';

function inferDesignCodesFromFeatures(
  features: any[],
  imageProperties: any
): string[] {
  const designCodes = new Set<string>();
  const colorInfo = imageProperties?.dominantColors?.colors || [];

  features.forEach((feature) => {
    const featureName = (
      feature.description ||
      feature.name ||
      ''
    ).toLowerCase();
    if (!featureName) return;

    // Celestial Bodies (01 series)
    if (/star|astro|celestial/i.test(featureName)) designCodes.add('01.01.01');
    if (/sun|solar/i.test(featureName)) designCodes.add('01.03.01');
    if (/moon|lunar/i.test(featureName)) designCodes.add('01.07.01');
    if (/planet|saturn|mars/i.test(featureName)) designCodes.add('01.11.01');

    // Human Figures (02 series)
    if (/face|head|portrait/i.test(featureName)) designCodes.add('02.03.01');
    if (/hand|finger|palm/i.test(featureName)) designCodes.add('02.09.01');
    if (/eye|iris|pupil/i.test(featureName)) designCodes.add('02.09.04');
    if (/lip|mouth/i.test(featureName)) designCodes.add('02.09.08');
    if (/arm|forearm/i.test(featureName)) designCodes.add('02.09.14');
    if (/leg|foot|feet/i.test(featureName)) designCodes.add('02.09.20');

    // Animals (03 series)
    if (/lion|tiger|cat|feline/i.test(featureName)) designCodes.add('03.01.01');
    if (/dog|wolf|canine/i.test(featureName)) designCodes.add('03.01.08');
    if (/bear|panda/i.test(featureName)) designCodes.add('03.01.14');
    if (/horse|stallion|equine/i.test(featureName)) designCodes.add('03.03.01');
    if (/cow|bull|cattle/i.test(featureName)) designCodes.add('03.04.01');
    if (/sheep|goat/i.test(featureName)) designCodes.add('03.04.11');
    if (/bird|wing/i.test(featureName)) designCodes.add('03.07.01');
    if (/eagle|hawk|falcon/i.test(featureName)) designCodes.add('03.07.02');
    if (/dove|peace.bird/i.test(featureName)) designCodes.add('03.07.09');
    if (/fish|marine/i.test(featureName)) designCodes.add('03.09.01');
    if (/snake|serpent/i.test(featureName)) designCodes.add('03.11.01');
    if (/dragon|mythical/i.test(featureName)) designCodes.add('03.11.13');

    // Plants (05 series)
    if (/tree|palm/i.test(featureName)) designCodes.add('05.01.01');
    if (/leaf|foliage/i.test(featureName)) designCodes.add('05.03.01');
    if (/flower|bloom|petal/i.test(featureName)) designCodes.add('05.05.01');
    if (/fruit|apple|orange/i.test(featureName)) designCodes.add('05.07.01');
    if (/grain|wheat|corn/i.test(featureName)) designCodes.add('05.07.02');

    // Buildings (07 series)
    if (/house|building|structure/i.test(featureName))
      designCodes.add('07.01.01');
    if (/castle|fortress/i.test(featureName)) designCodes.add('07.01.02');
    if (/church|temple|religious/i.test(featureName))
      designCodes.add('07.01.03');
    if (/bridge|arch/i.test(featureName)) designCodes.add('07.11.01');
    if (/tower|antenna/i.test(featureName)) designCodes.add('07.05.02');

    // Implements (08 series)
    if (/tool|implement/i.test(featureName)) designCodes.add('08.01.01');
    if (/hammer|mallet/i.test(featureName)) designCodes.add('08.01.03');
    if (/sword|blade/i.test(featureName)) designCodes.add('08.03.01');
    if (/key|lock/i.test(featureName)) designCodes.add('08.07.01');

    // Clothing (09 series)
    if (/clothing|garment|apparel/i.test(featureName))
      designCodes.add('09.01.01');
    if (/hat|cap|crown/i.test(featureName)) designCodes.add('09.05.01');
    if (/shoe|boot|footwear/i.test(featureName)) designCodes.add('09.09.01');

    // Transportation (18 series)
    if (/vehicle|car|auto/i.test(featureName)) designCodes.add('18.01.01');
    if (/train|railway/i.test(featureName)) designCodes.add('18.05.01');
    if (/plane|aircraft/i.test(featureName)) designCodes.add('18.05.03');
    if (/ship|boat|vessel/i.test(featureName)) designCodes.add('18.03.02');

    // Geometric Figures (26 series)
    if (/circle|round/i.test(featureName)) designCodes.add('26.01.01');
    if (/triangle/i.test(featureName)) designCodes.add('26.03.01');
    if (/square|rectangle/i.test(featureName)) designCodes.add('26.05.01');
    if (/hexagon|octagon/i.test(featureName)) designCodes.add('26.05.09');
    if (/curved.line|wave/i.test(featureName)) designCodes.add('26.11.01');
    if (/straight.line|stripe/i.test(featureName)) designCodes.add('26.11.02');
    if (/arrow|pointer/i.test(featureName)) designCodes.add('26.11.21');

    // Letters & Numbers (27 series)
    if (/text|letter|word/i.test(featureName)) designCodes.add('27.03.01');
    if (/number|digit|numeric/i.test(featureName)) designCodes.add('27.07.01');
    if (/script|cursive/i.test(featureName)) designCodes.add('27.03.05');
    if (/greek|latin/i.test(featureName)) designCodes.add('27.03.02');

    // Inscriptions (28 series)
    if (/inscription|writing/i.test(featureName)) designCodes.add('28.11.01');
    if (/chinese|japanese|asian/i.test(featureName))
      designCodes.add('28.03.01');
    if (/arabic|farsi/i.test(featureName)) designCodes.add('28.01.01');
  });

  // Color Analysis (29 series)
  colorInfo.forEach((color) => {
    if (color.score > 0.2) {
      const { red = 0, green = 0, blue = 0 } = color.color || {};
      if (red > 200 && green < 100 && blue < 100) designCodes.add('29.01.01'); // Red
      if (red < 100 && green > 200 && blue < 100) designCodes.add('29.01.03'); // Green
      if (red < 100 && green < 100 && blue > 200) designCodes.add('29.01.04'); // Blue
      if (red > 200 && green > 200 && blue < 100) designCodes.add('29.01.02'); // Yellow
      if (red < 50 && green < 50 && blue < 50) designCodes.add('29.01.08'); // Black
      if (red > 200 && green > 200 && blue > 200) designCodes.add('29.01.06'); // White
    }
  });

  return Array.from(designCodes);
}

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_CLOUD_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [
            {
              image: { content: image.split(',')[1] },
              features: [
                { type: 'LOGO_DETECTION', maxResults: 5 },
                { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
                { type: 'LABEL_DETECTION', maxResults: 10 },
                { type: 'IMAGE_PROPERTIES', maxResults: 5 },
                { type: 'DOCUMENT_TEXT_DETECTION' },
              ],
            },
          ],
        }),
      }
    );

    const visionData = await visionResponse.json();
    const allFeatures = [
      ...(visionData.responses[0]?.logoAnnotations || []),
      ...(visionData.responses[0]?.localizedObjectAnnotations || []),
      ...(visionData.responses[0]?.labelAnnotations || []),
    ].filter((f) => f && (f.description || f.name));

    const designCodes = inferDesignCodesFromFeatures(
      allFeatures,
      visionData.responses[0]?.imageProperties
    );

    const usptoResults = await Promise.all(
      designCodes.map(async (code) => {
        const response = await fetch(
          `https://tsdrapi.uspto.gov/ts/cd/casestatus/design/${code}/info`,
          {
            method: 'GET',
            headers: {
              'USPTO-API-KEY': process.env.USPTO_API_KEY || '',
            },
          }
        );

        if (!response.ok) return null;
        const result = await response.text();
        return { code, result };
      })
    );

    return NextResponse.json({
      logoDetection:
        visionData.responses[0]?.logoAnnotations?.map((logo) => ({
          name: logo.description,
          confidence: logo.score,
        })) || [],
      features: allFeatures.map((f) => f.description || f.name).filter(Boolean),
      designCodes,
      trademarkResults: usptoResults.filter(Boolean),
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
