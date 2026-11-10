# -*- coding: utf-8 -*-
"""
Ejemplo rápido de uso de Hugging Face desde Python.

Requisitos:
  pip install "torch>=2.0" transformers huggingface_hub
  (si usas GPU, instala la versión adecuada de torch).

1️⃣ Obtén un token de acceso en https://huggingface.co/settings/tokens
   y añádelo a tu entorno:
   export HUGGINGFACE_TOKEN="<TU_TOKEN>"
   (o colócalo en un archivo .env y carga con python-dotenv).

2️⃣ Ejecuta este script desde cualquier carpeta:
   python huggingface_demo.py
"""

import os
import sys
from pathlib import Path

# Cargar token desde variable de entorno
HF_TOKEN = os.getenv("HUGGINGFACE_TOKEN")
if not HF_TOKEN:
    print("[ERROR] La variable de entorno HUGGINGFACE_TOKEN no está definida.")
    print("Define el token con: export HUGGINGFACE_TOKEN='TU_TOKEN'")
    sys.exit(1)

# ---------------------------------------------------------------------
# 1️⃣ Inferencia de texto (modelo causal)
# ---------------------------------------------------------------------
from transformers import pipeline

text_generator = pipeline(
    "text-generation",
    model="gpt2",  # Puedes cambiar a cualquier modelo compatible, p.e. "meta-llama/Meta-Llama-3.1-8B-Instruct"
    token=HF_TOKEN,
    device=0 if torch.cuda.is_available() else -1,  # usa GPU si está disponible
)

prompt = "En una noche estrellada, los viajeros descubren"
print("\n--- Generación de texto ---")
print(f"Prompt: {prompt}\n")
result = text_generator(prompt, max_new_tokens=50, do_sample=True, temperature=0.8)
print(result[0]["generated_text"])  # muestra el texto generado

# ---------------------------------------------------------------------
# 2️⃣ Inferencia de visión (clasificación de imagen)
# ---------------------------------------------------------------------
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import requests

model_name = "google/vit-base-patch16-224"
processor = AutoImageProcessor.from_pretrained(model_name, token=HF_TOKEN)
model = AutoModelForImageClassification.from_pretrained(model_name, token=HF_TOKEN)

# Puedes cambiar la URL por la ruta local a tu imagen
image_url = "https://images.unsplash.com/photo-1518791841217-8f162f1e1131"
image = Image.open(requests.get(image_url, stream=True).raw)

inputs = processor(images=image, return_tensors="pt")
with torch.no_grad():
    logits = model(**inputs).logits

predicted_class_idx = logits.argmax(-1).item()
label = model.config.id2label[predicted_class_idx]
print("\n--- Clasificación de imagen ---")
print(f"Modelo: {model_name}")
print(f"Etiqueta predicha: {label}")

# ---------------------------------------------------------------------
# 3️⃣ Uso dentro de un agente Google Antigravity (opcional)
# ---------------------------------------------------------------------
# Si quieres exponer estas funciones como herramientas en un agente, ve al
# archivo examples/getting_started/custom_tool.md del SDK para ver cómo
# declarar funciones Python y asociarlas a `tools`.
# ---------------------------------------------------------------
# Ejemplo rápido de wrapper de herramienta:
#
# def hf_text_generate(prompt: str, max_tokens: int = 100) -> str:
#     out = text_generator(prompt, max_new_tokens=max_tokens)[0]["generated_text"]
#     return out
#
# def hf_image_classify(image_path: str) -> str:
#     img = Image.open(image_path)
#     inputs = processor(images=img, return_tensors="pt")
#     logits = model(**inputs).logits
#     label = model.config.id2label[logits.argmax(-1).item()]
#     return label
# ---------------------------------------------------------------

if __name__ == "__main__":
    # El script ya ha ejecutado las demos anteriores al importarse.
    pass
