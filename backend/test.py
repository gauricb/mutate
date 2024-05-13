from langchain.prompts import load_prompt
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI
from tools import router_func, translate_func

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

def test_translate(data: dict):
    source_lang = data.get("source_lang")
    target_lang = data.get("target_lang")
    source_code = data.get("source_code")
    correct_translation = data.get("correct_translation")
    should_use_expert = data.get("should_use_expert")

    router_dict = router_func(source_lang, target_lang, source_code)

    junior_model = "gpt-3.5-turbo"
    expert_model = "gpt-4-turbo-preview"

    used_expert = router_dict["expert"].lower() in ['true', '"true"']
    generated_translation = translate_func(
        model_name=(expert_model if used_expert else junior_model),
        source_lang=source_lang,
        target_lang=target_lang,
        source_code=source_code,
    )

    evaluation = evaluate_func("gpt-3.5-turbo", target_lang, correct_translation, generated_translation)

    return {
        "translated_correctly": evaluation,
        "routed_correctly": should_use_expert if used_expert else evaluation
    }

test_cases = [
    {
        "source_lang": "Python",
        "target_lang": "Javascript",
        "source_code": """
def add_two(a, b):
    return a + b
print(add_two(3, 6))
""",
        "correct_translation": """
function add_a_couple(c, d) {
    return d + c;
}
console.log(add_a_couple(3, 6));
"""
    },
    {
        "source_lang": "",
        "target_lang": "",
        "source_code": "",
        "correct_translation": ""
    },
    {
        "source_lang": "",
        "target_lang": "",
        "source_code": "",
        "correct_translation": ""
    },
]

for data in test_cases:
    result = test_translate(data)
    assert(result["translated_correctly"])
    assert(result["routed_correctly"])
