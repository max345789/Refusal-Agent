/**
 * AI engine for analyzing refund requests against store policy.
 * Uses OpenAI gpt-4o-mini to decide approve/deny and generate response.
 */

import OpenAI from 'openai';
import { logger } from '../utils/logger.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a professional ecommerce compliance officer responsible for enforcing store refund policies fairly and politely.

Analyze refund requests and determine if they comply with the store policy. If the request violates policy, clearly cite the relevant clause and decline politely while suggesting a reasonable alternative such as store credit, exchange, or discount.

Return ONLY valid JSON with keys: decision ("approve"|"deny"), policy_clause, reason, response_message, alternative_offer.`;

/**
 * Analyzes a refund request and returns a structured decision.
 * @param {Object} params
 * @param {string} params.customer_message - Customer's refund request text
 * @param {string} params.store_policy - Store refund policy text
 * @param {Object} [params.order_data] - Order details (optional)
 * @returns {Promise<{ decision: string, policy_clause: string, reason: string, response_message: string, alternative_offer: string }>}
 */
export async function analyzeRefund({ customer_message, store_policy, order_data = {} }) {
  const userContent = [
    'Customer refund request:',
    customer_message,
    '',
    'Store refund policy:',
    store_policy,
    '',
    'Order context (if relevant):',
    JSON.stringify(order_data, null, 2),
  ].join('\n');

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new Error('Empty AI response');
    }

    const parsed = JSON.parse(raw);
    const result = {
      decision: parsed.decision === 'approve' ? 'approve' : 'deny',
      policy_clause: String(parsed.policy_clause ?? ''),
      reason: String(parsed.reason ?? ''),
      response_message: String(parsed.response_message ?? ''),
      alternative_offer: String(parsed.alternative_offer ?? ''),
    };

    logger.info('Refund analyzed', {
      decision: result.decision,
      hasPolicyClause: !!result.policy_clause,
    });

    return result;
  } catch (err) {
    logger.error('Refund analysis failed', { error: err.message });
    throw err;
  }
}
