// Small helper to talk to Claude. Used only by the AI-powered test.
// The client is created LAZILY (only when first needed), so the rest of the framework
// works fine even if you have no API key.
require('dotenv').config({ quiet: true });

const DEFAULT_MODEL = 'claude-sonnet-5-5';
let client = null;

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set. Add it to your .env file to use the AI helper.');
  }
  if (!client) {
    const Anthropic = require('@anthropic-ai/sdk');
    const Ctor = Anthropic.default || Anthropic.Anthropic || Anthropic;
    client = new Ctor({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

/** Send a prompt to Claude and get the plain-text answer back. */
async function askClaude(prompt, { maxTokens = 1024 } = {}) {
  const response = await getClient().messages.create({
    model: process.env.CLAUDE_MODEL || DEFAULT_MODEL,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  });
  return response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');
}

/** Ask Claude for JSON and return it as a JavaScript object. */
async function generateJson(prompt) {
  const text = await askClaude(
    `${prompt}\n\nRespond with valid JSON only. No explanation and no markdown code fences.`
  );
  // Models sometimes wrap JSON in ``` fences anyway, so strip them defensively.
  const cleaned = text.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
  return JSON.parse(cleaned);
}

module.exports = { askClaude, generateJson };
