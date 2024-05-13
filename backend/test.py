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
""",
        "should_use_expert": False
    },
    {
        "source_lang": "Java",
        "target_lang": "C#",
        "source_code": "public int indexOfValue(int value) {for (int i = 0; i < mSize; i++)if (mValues[i] == value)return i;return -1;}",
        "correct_translation": "public virtual int indexOfValue(int value){{for (int i = 0; i < mSize; i++){if (mValues[i] == value){return i;}}}return -1;}",
        "should_use_expert": False
    },
    {
        "source_lang": "C#",
        "target_lang": "Java",
        "source_code": "public virtual SpanQuery MakeSpanClause(){List<SpanQuery> spanQueries = new List<SpanQuery>();foreach (var wsq in weightBySpanQuery){wsq.Key.Boost = wsq.Value;spanQueries.Add(wsq.Key);}if (spanQueries.Count == 1)return spanQueries[0];else return new SpanOrQuery(spanQueries.ToArray());}",
        "correct_translation": "public SpanQuery makeSpanClause() {SpanQuery [] spanQueries = new SpanQuery[size()];Iterator<SpanQuery> sqi = weightBySpanQuery.keySet().iterator();int i = 0;while (sqi.hasNext()) {SpanQuery sq = sqi.next();float boost = weightBySpanQuery.get(sq);if (boost != 1f) {sq = new SpanBoostQuery(sq, boost);}spanQueries[i++] = sq;}if (spanQueries.length == 1)return spanQueries[0];else return new SpanOrQuery(spanQueries);}",
        "should_use_expert": False
    },
]

for data in test_cases:
    result = test_translate(data)
    assert(result["translated_correctly"])
    assert(result["routed_correctly"])
