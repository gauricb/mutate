from typing import Union
from tools import translate_func, router_func
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/translate")
async def translate(data: dict):
    source_lang = data.get("source_lang")
    target_lang = data.get("target_lang")
    source_code = data.get("source_code")

    router_dict = router_func(source_lang, target_lang, source_code)

    junior_model = "gpt-3.5-turbo"
    expert_model = "gpt-4-turbo-preview"

    if router_dict["expert"].lower() == "true":
        translated_text = translate_func(
            model_name=expert_model,
            source_lang=source_lang,
            target_lang=target_lang,
            source_code=source_code,
        )
        reason = router_dict["reason"]
        return {"translated_text": translated_text, "reason": reason}
    else:
        translated_text = translate_func(
            model_name=junior_model,
            source_lang=source_lang,
            target_lang=target_lang,
            source_code=source_code,
        )
        reason = router_dict["reason"]
        return {"translated_text": translated_text, "reason": reason}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
