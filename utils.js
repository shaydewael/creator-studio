import 'dotenv/config';
import fetch from 'node-fetch';

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = [
    '😭',
    '😄',
    '😌',
    '🤓',
    '😎',
    '😤',
    '🤖',
    '😶‍🌫️',
    '🌏',
    '📸',
    '💿',
    '👋',
    '🌊',
    '✨',
    '👻',
  ];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

// This function makes REST API calls using https://www.npmjs.com/package/node-fetch
// It prepends the API URL, so you just have to pass in the endpoint URL
// Payloads will go in the "body" field
export async function DiscordRequest(endpoint, options) {
  const baseURL = 'https://discord.com/api/v10';
  // This just looks for the `/` at the beginning of endpoint, and if it doesn't exist, adds it. Could remove this.
  const fEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // append endpoint to base API URL
  // See https://discord.com/developers/docs/reference#api-versioning
  const url = baseURL + fEndpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use node-fetch to make requests
  // JavaScript note: `${var}` allows u to create strings with variables contained in them
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.BOT_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    ...options,
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}