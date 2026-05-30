/**
 * POST /api/translate
 * Body: { texts: string[], targetLang: 'es' | 'pt' }
 * Returns: { translations: string[] }
 *
 * Server-side only — DeepL key never sent to browser.
 */

const DEEPL_KEY = process.env.DEEPL_API_KEY;
const DEEPL_URL = DEEPL_KEY?.endsWith(':fx')
  ? 'https://api-free.deepl.com/v2/translate'
  : 'https://api.deepl.com/v2/translate';

const DEEPL_LANG = { es: 'ES', pt: 'PT-BR' };

export async function POST(req) {
  try {
    const { texts, targetLang } = await req.json();

    if (!texts?.length || !targetLang) {
      return Response.json({ error: 'Missing texts or targetLang' }, { status: 400 });
    }

    if (!DEEPL_KEY) {
      return Response.json({ error: 'DEEPL_API_KEY not configured' }, { status: 500 });
    }

    const lang = DEEPL_LANG[targetLang];
    if (!lang) {
      return Response.json({ error: `Unsupported language: ${targetLang}` }, { status: 400 });
    }

    // Batch into chunks of 50 (DeepL per-request safe limit)
    const CHUNK = 50;
    const allTranslations = [];

    for (let i = 0; i < texts.length; i += CHUNK) {
      const chunk = texts.slice(i, i + CHUNK);

      const res = await fetch(DEEPL_URL, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${DEEPL_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: chunk,
          target_lang: lang,
          source_lang: 'EN',
          preserve_formatting: true,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('DeepL error:', res.status, err);
        // Return originals for this chunk rather than failing the whole request
        allTranslations.push(...chunk);
        continue;
      }

      const data = await res.json();
      allTranslations.push(...data.translations.map(t => t.text));
    }

    return Response.json({ translations: allTranslations });
  } catch (err) {
    console.error('Translate route error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
