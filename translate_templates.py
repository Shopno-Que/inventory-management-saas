import os
import re
import shutil
from deep_translator import GoogleTranslator

# ---- CONFIG ----
TEMPLATES_DIR = r"C:\work\hishab-khata"
BACKUP_DIR = r"C:\work\hishab-khata_backup"
BANGLA_REGEX = re.compile(r'[\u0980-\u09FF]+[\u0980-\u09FF\s,।.!?]*')
SKIP_DIRS = {"venv", "env", ".venv", "node_modules", "staticfiles", "__pycache__", ".git"}

translator = GoogleTranslator(source='bn', target='en')

def translate_text(text):
    text = text.strip()
    if not text:
        return text
    try:
        result = translator.translate(text)
        if not result:  # catches None or empty string
            print(f"  ! Empty/None result for: {text[:30]}...")
            return text
        return result
    except Exception as e:
        print(f"  ! Failed to translate: {text[:30]}... ({e})")
        return text  # leave original if it fails
def process_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    matches = BANGLA_REGEX.findall(content)
    if not matches:
        return

    print(f"Translating {len(matches)} strings in {filepath}")
    new_content = content
    for bangla_text in set(matches):
        try:
            english_text = translate_text(bangla_text)
            if english_text:
                new_content = new_content.replace(bangla_text, english_text)
        except Exception as e:
            print(f"  ! Skipping string due to error: {bangla_text[:30]}... ({e})")
            continue

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
def main():
    # backup first
    if not os.path.exists(BACKUP_DIR):
        shutil.copytree(TEMPLATES_DIR, BACKUP_DIR, ignore=shutil.ignore_patterns(*SKIP_DIRS))
        print(f"Backup created at {BACKUP_DIR}")

    for root, dirs, files in os.walk(TEMPLATES_DIR):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]  # prune skip dirs
        for file in files:
            if file.endswith(".html"):
                process_file(os.path.join(root, file))

    print("Done. Review the translated files, and compare with backup if needed.")

if __name__ == "__main__":
    main()