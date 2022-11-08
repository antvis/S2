/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const projectId = 'crested-sunup-368006';
const location = 'global';
const text = '你好，世界！';

// Imports the Google Cloud Translation library
const {TranslationServiceClient} = require('@google-cloud/translate');

// Instantiates a client
const translationClient = new TranslationServiceClient();

async function translateText() {
  // Construct request
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [text],
    mimeType: 'text/plain', // mime types: text/plain, text/html
    sourceLanguageCode: 'zh',
    targetLanguageCode: 'en',
  };

  console.log(request, 'request');
  // Run request
  try {
  const [response] = await translationClient.translateText(request);
  console.log(response, 'response');
    for (const translation of response.translations) {
      console.log(`Translation: ${translation.translatedText}`);
    }
  } catch (error) {
    console.log(error, 'error');
  }

}

translateText();
