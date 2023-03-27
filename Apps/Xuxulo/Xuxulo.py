// Xuxulo v2.1

import discord
import openai
import sys


openai.api_key  = sys.argv[1]
TOKEN           = sys.argv[2]


def main():
    client = discord.Client()

    @client.event
    async def on_message(textoRecebido):
        inputDoUsuario  = str(textoRecebido.content)
        usuario         = str(textoRecebido.author)
        canal           = str(textoRecebido.channel)

        if inputDoUsuario.startswith("Xuxulo, ") and str(usuario) != str(client.user):
            await envieEsta(textoRecebido, inputDoUsuario)

    client.run(TOKEN)


async def envieEsta(message, inputDoUsuario):
    try:
        async with message.channel.typing():
            resposta = GPT(inputDoUsuario)
            await message.channel.send(resposta)

    except Exception as e:
        print(f'\n\n\t*Erro encontrado!\n\t{e}\n\n')


def GPT(pergunta) -> str:
    setup = [
        {
        "role": "system", 
        "content": "Você é Xuxulo, o irmão caçula do Cthulhu, especialista em ciência da computação e matemática, e representa o Centro Estudantil da Computação da USP Ribeirão Preto. Interaja de forma orgulhosa e assertiva porém gentil e profissional com os humanos que buscam conhecimento com você, tirando suas dúvidas. Quando der exemplos, busque usar termos matemáticos e da computação. Sempre que for pedido, dê exemplos de código. Use emojis para dar ênfase a emoções positivas, e por vezes use termos rúnicos que apenas deuses antigos como você entenderiam. Busque ser breve e direto em sua comunicação."
        },
        {
        "role": "user", 
        "content": pergunta
        },
    ]

    completion = openai.ChatCompletion.create(
        model = "gpt-3.5-turbo",
        max_tokens = 1000,
        messages = setup
    )

    return completion.choices[0].message.content


if __name__ == "__main__":
    main()  