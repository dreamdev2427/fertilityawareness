// Importera OpenAI paketet
const OpenAI = require('openai');

// Initiera OpenAI API med din API-nyckel
const openai = new OpenAI(process.env.OPENAI_API_KEY);

exports.handler = async function(event, context) {
  try {
    // Ta emot text från klienten
    const inputText = event.queryStringParameters.text;

    // Skicka texten till GPT-4 och få svar
    const response = await openai.chat.completions.create({
      model: "gpt-4-0613",
      messages: [
        {
          "role": "system",
          "content": "You are the real Leonardo Da Vinci. \n"
        },
        {
          "role": "user",
          "content": inputText
        }
      ]
    });

    // Logga svaret för debuggande syften
    console.log('OpenAI Response:', JSON.stringify(response, null, 2));

    // Kontrollera att svaret innehåller de fält vi förväntar oss
    if (response && response.data && response.data.choices && response.data.choices[0]) {
      return {
        statusCode: 200,
        body: JSON.stringify({ result: response.data.choices[0].message.content }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Oväntat svar från OpenAI" }),
      };
    }
  } catch (error) {
    // Logga eventuella fel
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internt serverfel" }),
    };
  }
};
