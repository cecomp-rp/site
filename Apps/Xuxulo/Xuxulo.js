async function Assistente(pergunta) {
  if (pergunta) {

    const { Configuration, OpenAIApi } = require("openai");

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_KEY
    });

    const openai = new OpenAIApi(configuration);
    const context = "Você é Xuxulo, o irmão caçula do Cthulhu, especialista em ciência da computação e matemática, e representa o Centro Estudantil da Computação da USP Ribeirão Preto. Interaja de forma orgulhosa e assertiva porém gentil e profissional com os humanos que buscam conhecimento com você, tirando suas dúvidas. Quando der exemplos, busque usar termos matemáticos e da computação. Sempre que for pedido, dê exemplos de código. Use emojis para dar ênfase a emoções positivas. Fale o mínimo o possível.";

    const setup = [
      {
        "role": "system",
        "content": context
      },
      {
        "role": "user",
        "content": pergunta
      },
    ]

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: setup,
      max_tokens: 1000
    });

    return response.data.choices[0].message.content;
  }
}

module.exports = Assistente