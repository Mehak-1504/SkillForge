import spacy
import re
import sys
import json
from pdfminer.high_level import extract_text

# Load spaCy English NLP model
nlp = spacy.load("en_core_web_sm")

# Get the resume file path from command line
resume_path = sys.argv[1]
text = extract_text(resume_path)

doc = nlp(text)

# Extract name (first named entity that's a PERSON)
name = ""
for ent in doc.ents:
    if ent.label_ == "PERSON":
        name = ent.text
        break

# Extract email
email_match = re.search(r'[\w\.-]+@[\w\.-]+', text)
email = email_match.group(0) if email_match else ""

# Extract mobile number
phone_match = re.search(r'\+?\d[\d\s.-]{8,}', text)
phone = phone_match.group(0).strip() if phone_match else ""

# Very basic skill extraction from keywords
skills_list = ["python", "java", "c++", "sql", "html", "css", "javascript", "react", "machine learning", "deep learning"]
found_skills = [skill for skill in skills_list if skill.lower() in text.lower()]

# Output as JSON
output = {
    "name": name,
    "email": email,
    "phone": phone,
    "skills": found_skills
}

print(json.dumps(output))