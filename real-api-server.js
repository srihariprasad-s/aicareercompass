// Import required modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

// Initialize express app
const app = express();
const PORT = 3000; // Using port 3000 instead of 5000 to avoid conflicts

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

// Check for API keys
if (!process.env.HUGGINGFACE_API_KEY && !process.env.OPENAI_API_KEY && !process.env.DEEPSEEK_API_KEY) {
  console.error('Error: No API keys found in .env file');
  console.error('Please add at least one of: HUGGINGFACE_API_KEY, OPENAI_API_KEY, or DEEPSEEK_API_KEY');
  process.exit(1);
}

// Set default provider
let currentProvider = process.env.HUGGINGFACE_API_KEY ? "huggingface" : 
                     (process.env.OPENAI_API_KEY ? "openai" : "deepseek");

console.log(`Starting with provider: ${currentProvider}`);

// API endpoint to get current provider
app.get('/api/current-provider', (req, res) => {
  res.json({
    provider: currentProvider,
    message: `Current AI provider: ${currentProvider.charAt(0).toUpperCase() + currentProvider.slice(1)}`
  });
});

// API endpoint to change provider
app.post('/api/change-provider', (req, res) => {
  const { provider } = req.body;
  
  // Validate provider
  if (provider !== 'huggingface' && provider !== 'openai' && provider !== 'deepseek') {
    return res.status(400).json({ error: 'Invalid provider' });
  }
  
  // Check if we have the API key for the requested provider
  if (provider === 'huggingface' && !process.env.HUGGINGFACE_API_KEY) {
    return res.status(400).json({ error: 'Hugging Face API key not found' });
  } else if (provider === 'openai' && !process.env.OPENAI_API_KEY) {
    return res.status(400).json({ error: 'OpenAI API key not found' });
  } else if (provider === 'deepseek' && !process.env.DEEPSEEK_API_KEY) {
    return res.status(400).json({ error: 'DeepSeek API key not found' });
  }
  
  // Change provider
  currentProvider = provider;
  console.log(`Switched to provider: ${currentProvider}`);
  
  res.json({
    provider: currentProvider,
    message: `Switched to ${currentProvider.charAt(0).toUpperCase() + currentProvider.slice(1)}`
  });
});

// API endpoint for career analysis
app.post('/api/career-analysis', async (req, res) => {
  try {
    const { jobTitle, hometown } = req.body;
    
    if (!jobTitle || !hometown) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    let result;
    
    // Call the appropriate API based on the provider
    if (currentProvider === 'huggingface') {
      result = await getHuggingFaceAnalysis(jobTitle, hometown);
    } else if (currentProvider === 'openai') {
      result = await getOpenAIAnalysis(jobTitle, hometown);
    } else if (currentProvider === 'deepseek') {
      result = await getDeepSeekAnalysis(jobTitle, hometown);
    } else {
      return res.status(500).json({ error: 'Invalid provider configuration' });
    }
    
    // Store the result (in a real app, this would go to a database)
    const analysisResult = {
      id: Date.now(), // Using timestamp as ID
      jobTitle,
      hometown,
      createdAt: new Date().toISOString(),
      resultData: result
    };
    
    res.json(analysisResult);
  } catch (error) {
    console.error('Error in career analysis:', error);
    res.status(500).json({ error: 'Failed to generate career analysis' });
  }
});

// API endpoint to get analysis by ID
app.get('/api/career-analysis/:id', (req, res) => {
  // In a real app, this would fetch from a database
  // For now, we'll return a dummy response
  const id = parseInt(req.params.id);
  
  // This would be a database lookup in a real app
  res.json({
    id,
    jobTitle: "Sample Job",
    hometown: "Sample Location",
    createdAt: new Date().toISOString(),
    resultData: { 
      /* This would be the stored analysis result */ 
      jobTitle: "Sample Job",
      hometown: "Sample Location",
      // Include other required fields here...
      analysisDate: new Date().toISOString()
    }
  });
});

// Hugging Face API integration
async function getHuggingFaceAnalysis(jobTitle, hometown) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  const model = "mistralai/Mixtral-8x7B-Instruct-v0.1"; // Using Mixtral model
  
  const prompt = `
    Provide a comprehensive career analysis for the position of ${jobTitle} for someone living in ${hometown}.
    
    The response must be in this JSON format:
    {
      "jobTitle": "${jobTitle}",
      "hometown": "${hometown}",
      "highestSalary": "string",
      "homeCurrency": "string",
      "bestCountry": "string", 
      "bestCompany": "string",
      "costOfLiving": "string",
      "monthlySavings": "string",
      "educationRequirement": "string",
      "whatToStudy": {
        "courses": [{"title": "string", "provider": "string", "description": "string"}],
        "certifications": [{"name": "string", "provider": "string", "description": "string", "value": number}]
      },
      "careerPath": {
        "steps": [{"title": "string", "yearsExperience": "string", "responsibilities": ["string"], "salaryRange": "string"}],
        "alternatives": [{"title": "string", "description": "string", "path": "string", "earnings": "string"}]
      },
      "visaInfo": {
        "country": "string",
        "requirements": "string",
        "considerations": ["string"]
      },
      "skills": {
        "technical": ["string"],
        "soft": [{"name": "string", "importance": number}]
      },
      "remoteWork": {
        "availability": "string",
        "description": "string",
        "companies": [{"name": "string", "description": "string"}]
      },
      "timeToJobReady": {
        "duration": "string",
        "description": "string",
        "stages": [{"name": "string", "duration": "string", "percentage": number}]
      },
      "jobOpportunities": [
        {
          "title": "string",
          "company": "string",
          "location": "string",
          "description": "string",
          "skills": ["string"],
          "salary": "string",
          "tags": ["string"]
        }
      ],
      "marketTrends": {
        "status": "string",
        "description": "string",
        "growthAreas": [{"name": "string", "percentage": number}]
      },
      "languages": {
        "primary": {"name": "string", "level": "string"},
        "additional": [{"code": "string", "name": "string", "description": "string"}]
      },
      "salaryData": [
        {"country": "string", "countryCode": "string", "salary": "string", "percentage": number}
      ],
      "costBreakdown": {
        "rent": "string",
        "groceries": "string",
        "transport": "string",
        "utilities": "string",
        "entertainment": "string",
        "other": "string"
      },
      "analysisDate": "string"
    }
    
    The response must be valid JSON without any markdown formatting, comments, or explanations.
  `;

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 2048,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Parse the response
    const result = response.data[0].generated_text;
    // Extract the JSON part from the response
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Invalid response format from Hugging Face API');
    }
  } catch (error) {
    console.error('Error calling Hugging Face API:', error);
    throw error;
  }
}

// OpenAI API integration (if you have an OpenAI key)
async function getOpenAIAnalysis(jobTitle, hometown) {
  // Similar implementation as Hugging Face but using OpenAI API
  // Code would go here if you have an OpenAI API key
  throw new Error('OpenAI API not implemented');
}

// DeepSeek API integration (if you have a DeepSeek key)
async function getDeepSeekAnalysis(jobTitle, hometown) {
  // Similar implementation as Hugging Face but using DeepSeek API
  // Code would go here if you have a DeepSeek API key
  throw new Error('DeepSeek API not implemented');
}

// Default route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start the server on localhost instead of all interfaces
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});