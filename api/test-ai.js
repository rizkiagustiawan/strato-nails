import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Say 'hello world'");
    console.log(`[SUCCESS] ${modelName}:`, result.response.text());
  } catch (err) {
    console.error(`[ERROR] ${modelName}:`, err.message);
  }
}

async function run() {
  console.log('Testing models with provided API key...');
  if (!process.env.GEMINI_API_KEY) {
    console.log('NO API KEY FOUND in .env');
    return;
  }
  
  await testModel('gemini-1.5-flash');
  await testModel('gemini-1.5-flash-latest');
  await testModel('gemini-1.5-pro');
  await testModel('gemini-pro-vision');
  await testModel('gemini-pro');
}

run();