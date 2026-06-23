import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Inisialisasi Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { image } = req.body; // base64 string

    if (!image) {
      return res.status(400).json({ success: false, error: 'Image is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, error: 'AI is not configured. Missing API Key.' });
    }

    // Ekstrak base64 data dan tipe mime
    // Format biasanya: data:image/jpeg;base64,/9j/4AAQSkZ...
    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, error: 'Invalid image format' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    // Menggunakan model gemini-1.5-flash untuk kecepatan dan analisa gambar
    // Menggunakan model gemini-flash-latest
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `You are a professional nail artist assistant. 
    Analyze the provided image of nail art and classify it into EXACTLY ONE of the following 5 categories:
    1. Manicure Only
    2. Nail Art Extensions
    3. Nail Extensions Plain Color
    4. Nail Art on Natural Nails
    5. Natural Nails Plain Color
    
    Rules:
    - If the nails look extended (very long, distinct structural shape), choose an "Extensions" category.
    - If there are patterns, gems, multiple colors per nail, or drawings, it's "Nail Art".
    - If it's a single solid color on natural length, it's "Natural Nails Plain Color".
    - If it's just clean bare nails or clear coat, it's "Manicure Only".
    
    Reply ONLY with the exact exact category name from the list above. Do not add any other words, punctuation, or explanations.`;

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const textResponse = result.response.text().trim();

    // Validasi jawaban AI agar sesuai dengan kategori yang ada
    const validCategories = [
      'Manicure Only',
      'Nail Art Extensions',
      'Nail Extensions Plain Color',
      'Nail Art on Natural Nails',
      'Natural Nails Plain Color'
    ];

    const matchedCategory = validCategories.find(cat => 
      textResponse.toLowerCase().includes(cat.toLowerCase())
    );

    if (matchedCategory) {
      return res.status(200).json({
        success: true,
        data: { category: matchedCategory }
      });
    } else {
      // Fallback jika AI menjawab aneh
      console.error('AI returned invalid category:', textResponse);
      return res.status(200).json({
        success: true,
        data: { category: 'Nail Art Extensions' } // Default fallback
      });
    }

  } catch (error: any) {
    console.error('AI Analysis Error Details:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to analyze image with AI' 
    });
  }
}
