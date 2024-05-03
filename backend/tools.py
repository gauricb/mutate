from langchain.prompts import load_prompt
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import re
import json

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


# router that picks which model will handle the translation
def router_func(source_lang: str, target_lang: str, source_code: str):
    prompt = load_prompt("prompts/router.yaml")
    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)
    chain = LLMChain(llm=llm, prompt=prompt, verbose=False)
    return extract_json_data(
        chain.invoke(
            {
                "source_lang": source_lang,
                "target_lang": target_lang,
                "source_code": source_code,
            }
        )["text"]
    )


def extract_json_data(text):
    json_text = re.search(r"```json\n?({[\w\W]+})[\n]?```", text)  # find ```json{}```
    if json_text:
        return json.loads(json_text.group(1))
    else:
        json_text = re.search(r"{[\w\W]+}", text)  # only find {}
        if json_text:
            return json.loads(json_text.group(0))
        else:
            print("No JSON found in text")
            return None


if __name__ == "__main__":
    # print(
    #     translate_func(
    #         model_name="gpt-3.5-turbo",
    #         source_lang="python",
    #         target_lang="javascript",
    #         source_code="print('Hello, World!')",
    #     )
    # )
    program = """
    import torch
import torch.nn as nn
import torch.nn.functional as F

class CNN(nn.Module):
    def __init__(self):
        super(CNN, self).__init__()
        # Define the convolutional layers
        self.conv1 = nn.Conv2d(in_channels=3, out_channels=32, kernel_size=3, stride=1, padding=1)
        self.conv2 = nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, stride=1, padding=1)
        # Define the max pooling layers
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2, padding=0)
        # Define fully connected layers
        self.fc1 = nn.Linear(64 * 16 * 16, 512)
        self.fc2 = nn.Linear(512, 10)  # 10 output classes for example
        
    def forward(self, x):
        # Apply convolutional layers followed by activation and pooling
        x = F.relu(self.conv1(x))
        x = self.pool(x)
        x = F.relu(self.conv2(x))
        x = self.pool(x)
        # Reshape the tensor for fully connected layers
        x = x.view(-1, 64 * 16 * 16)
        x = F.relu(self.fc1(x))
        x = self.fc2(x)
        return x

# Instantiate the CNN model
model = CNN()
print(model)

    """

    print(router_func("python", "javascript", program))
