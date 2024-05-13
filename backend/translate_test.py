from langchain.prompts import load_prompt
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI
from tools import router_func, translate_func


def evaluate_func(
    model_name: str,
    target_lang: str,
    correct_translation: str,
    generated_translation: str,
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
    )["text"].lower()


def test_translate(data: dict):
    source_lang = data.get("source_lang")
    target_lang = data.get("target_lang")
    source_code = data.get("source_code")
    correct_translation = data.get("correct_translation")
    should_use_expert = data.get("should_use_expert")

    router_dict = router_func(source_lang, target_lang, source_code)

    junior_model = "gpt-3.5-turbo"
    expert_model = "gpt-4-turbo-preview"

    used_expert = router_dict["expert"].lower() in ["true", '"true"']
    generated_translation = translate_func(
        model_name=(expert_model if used_expert else junior_model),
        source_lang=source_lang,
        target_lang=target_lang,
        source_code=source_code,
    )

    evaluation = evaluate_func(
        "gpt-3.5-turbo", target_lang, correct_translation, generated_translation
    )

    return {
        "translated_correctly": evaluation,
        "routed_correctly": should_use_expert if used_expert else evaluation,
    }


test_cases = [
    { # Handwritten
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
    { # CodeXGLUE
        "source_lang": "Java",
        "target_lang": "C#",
        "source_code": "public int indexOfValue(int value) {for (int i = 0; i < mSize; i++)if (mValues[i] == value)return i;return -1;}",
        "correct_translation": "public virtual int indexOfValue(int value){{for (int i = 0; i < mSize; i++){if (mValues[i] == value){return i;}}}return -1;}",
        "should_use_expert": False
    },
    { # CodeXGLUE
        "source_lang": "C#",
        "target_lang": "Java",
        "source_code": "public virtual SpanQuery MakeSpanClause(){List<SpanQuery> spanQueries = new List<SpanQuery>();foreach (var wsq in weightBySpanQuery){wsq.Key.Boost = wsq.Value;spanQueries.Add(wsq.Key);}if (spanQueries.Count == 1)return spanQueries[0];else return new SpanOrQuery(spanQueries.ToArray());}",
        "correct_translation": "public SpanQuery makeSpanClause() {SpanQuery [] spanQueries = new SpanQuery[size()];Iterator<SpanQuery> sqi = weightBySpanQuery.keySet().iterator();int i = 0;while (sqi.hasNext()) {SpanQuery sq = sqi.next();float boost = weightBySpanQuery.get(sq);if (boost != 1f) {sq = new SpanBoostQuery(sq, boost);}spanQueries[i++] = sq;}if (spanQueries.length == 1)return spanQueries[0];else return new SpanOrQuery(spanQueries);}",
        "should_use_expert": False
    },
    { # HumanEval-X (0)
        "source_lang": "Go",
        "target_lang": "Python",
        "source_code": "func HasCloseElements(numbers []float64, threshold float64) bool { for i := 0; i < len(numbers); i++ { for j := i + 1; j < len(numbers); j++ { var distance float64 = math.Abs(numbers[i] - numbers[j]) if distance < threshold { return true } } } return false }",
        "correct_translation": "from typing import List def has_close_elements(numbers: List[float], threshold: float) -> bool: for idx, elem in enumerate(numbers): for idx2, elem2 in enumerate(numbers): if idx != idx2: distance = abs(elem - elem2) if distance < threshold: return True return False",
        "should_use_expert": False
    },
    { # HumanEval-X (10)
        "source_lang": "Python",
        "target_lang": "Javascript",
        "source_code": "def is_palindrome(string: str) -> bool: return string == string[::-1] def make_palindrome(string: str) -> str:if not string: return '' beginning_of_suffix = 0 while not is_palindrome(string[beginning_of_suffix:]): beginning_of_suffix += 1 return string + string[:beginning_of_suffix][::-1]",
        "correct_translation": "const isPalindrome = (string) => { return string == string.split('').reverse().join(''); } const makePalindrome = (string) => { if (string == '') return ''; var beginning_of_suffix = 0; while (!isPalindrome(string.slice(beginning_of_suffix))) beginning_of_suffix += 1; return string + string.slice(0, beginning_of_suffix).split('').reverse().join(''); }",
        "should_use_expert": False
    },
    { # HumanEval-X (20)
        "source_lang": "Javascript",
        "target_lang": "C++",
        "source_code": "const findClosestElements = (numbers) => { var closest_pair, distance; for (let i = 0; i < numbers.length; i++) for (let j = 0; j < numbers.length; j++) if (i != j) { let a = numbers[i], b = numbers[j]; if (distance == null) { distance = Math.abs(a - b); closest_pair = [Math.min(a, b), Math.max(a, b)]; } else { let new_distance = Math.abs(a - b); if (new_distance < distance) { distance = new_distance; closest_pair = [Math.min(a, b), Math.max(a, b)]; } } } return closest_pair; }",
        "correct_translation": "#include<stdio.h> #include<math.h> #include<vector> using namespace std; #include<algorithm> #include<stdlib.h> vector<float> find_closest_elements(vector<float> numbers){ vector<float> out={}; for (int i=0;i<numbers.size();i++) for (int j=i+1;j<numbers.size();j++) if (out.size()==0 or abs(numbers[i]-numbers[j])<abs(out[0]-out[1])) out={numbers[i],numbers[j]}; if (out[0]>out[1]) out={out[1],out[0]}; return out; }",
        "should_use_expert": True
    },
    { # HumanEval-X (22)
        "source_lang": "C++",
        "target_lang": "Java",
        "source_code": "#include<stdio.h> #include<math.h> #include<vector> #include<string> #include<boost/any.hpp> #include<list> typedef std::list<boost::any> list_any; using namespace std; #include<algorithm> #include<stdlib.h> vector<int> filter_integers(list_any values){ list_any::iterator it; boost::any anyone; vector<int> out; for (it=values.begin();it!=values.end();it++) { anyone=*it; if( anyone.type() == typeid(int) ) out.push_back(boost::any_cast<int>(*it)); } return out; }",
        "correct_translation": "import java.util.*; import java.lang.*; class Solution { public List<Integer> filterIntergers(List<Object> values) { List<Integer> result = new ArrayList<>(); for (Object x : values) { if (x instanceof Integer) { result.add((Integer) x); } } return result; } }",
        "should_use_expert": True
    },
    { # HumanEval-X (29)
        "source_lang": "Java",
        "target_lang": "Javascript",
        "source_code": "import java.util.*; import java.lang.*; import java.util.stream.Collectors; class Solution { public List<String> filterByPrefix(List<String> strings, String prefix) { return strings.stream().filter(p -> p.startsWith(prefix)).collect(Collectors.toList()); } }",
        "correct_translation": "const filterByPrefix = (strings, prefix) => { return strings.filter(x => x.startsWith(prefix)); }",
        "should_use_expert": False
    },
    { # HumanEval-X (35)
        "source_lang": "Javascript",
        "target_lang": "Go",
        "source_code": "const maxElement = (l) => { return Math.max(...l); }",
        "correct_translation": "func MaxElement(l []int) int { max := l[0] for _, x := range l { if x > max { max = x } } return max }",
        "should_use_expert": False
    },
    { # HumanEval-X (44)
        "source_lang": "Go",
        "target_lang": "C++",
        "source_code": "func ChangeBase(x int, base int) string { if x >= base { return ChangeBase(x/base, base) + ChangeBase(x%base, base) } return strconv.Itoa(x) }",
        "correct_translation": "#include<stdio.h> #include<math.h> #include<string> using namespace std; #include<algorithm> #include<stdlib.h> string change_base(int x,int base){ string out=""; while (x>0) { out=to_string(x%base)+out; x=x/base; } return out; }",
        "should_use_expert": False
    }
]

for data in test_cases:
    result = test_translate(data)
    print(result)

    # assertion test, uncomment if you want to stop the pipeline if the test fails
    # assert result["translated_correctly"]
    # assert result["routed_correctly"]
