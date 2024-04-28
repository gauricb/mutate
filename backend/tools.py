from langchain.prompts import load_prompt
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()


def translate_func(
    model_name: str, source_lang: str, target_lang: str, source_code: str
):
    prompt = load_prompt("prompts/translator.yaml")

    llm = ChatOpenAI(model_name=model_name, temperature=0)
    chain = LLMChain(llm=llm, prompt=prompt, verbose=False)
    return chain.invoke(
        {
            "source_lang": source_lang,
            "target_lang": target_lang,
            "source_code": source_code,
        }
    )["text"]


if __name__ == "__main__":
    print(
        translate_func(
            model_name="gpt-3.5-turbo",
            source_lang="python",
            target_lang="javascript",
            source_code="print('Hello, World!')",
        )
    )
