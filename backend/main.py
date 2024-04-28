from typing import Union
from tools import translate_func
import uvicorn
from fastapi import FastAPI


app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/translate")
async def translate(source_lang: str, target_lang: str, source_code: str):

    return translate_func(
        model_name="gpt-3.5-turbo",
        source_lang=source_lang,
        target_lang=target_lang,
        source_code=source_code,
    )


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
