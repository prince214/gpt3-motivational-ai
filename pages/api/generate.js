import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = 
`Write me a professional motivational speech in the style of GoalCast Youtube channel using the words below. Don't add any greetings at the beginning or ending. and also write in a way that all the words connects to each other in someway. Don't give any title.
Words:`;
const basePromptSuffix = ` Dont add greetings at the begining.`;
const generateAction = async (req, res) => {
  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.8,
    max_tokens: 500,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();
  console.log(basePromptOutput);
  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
