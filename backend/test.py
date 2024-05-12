from langchain.prompts import load_prompt
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI

def evaluate_func(
    model_name: str, target_lang: str, correct_translation: str, generated_translation: str
):
    prompt = load_prompt("prompts/evaluator.yaml")
    llm = ChatOpenAI(model_name=model_name, temperature=0)
    chain = LLMChain(llm=llm, prompt=prompt, verbose=False)
    return chain.invoke(
        {
            "target_lang": target_lang,
            "correct_translation": correct_translation,
            "generated_translation": generated_translation,
        }
    )["text"].lower() in ['true', '"true"']
