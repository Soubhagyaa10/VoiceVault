from google import genai
import os

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_fir_from_testimony(user_input: str) -> str:
    prompt = f"""
You are an AI system that converts survivor testimonies into formal FIR-style police reports.

STRICT RULES:
- Clearly separate confirmed facts vs uncertain statements
- Do NOT hallucinate facts
- If information is missing, write "Not specified"
- If uncertain, write "Unclear"
- Maintain formal, neutral, legal tone
- Convert non-linear narration into chronological order

----------------------------------------

FORMAT:

FIRST INFORMATION REPORT (FIR)

1. Complainant Details:
Name: Not specified  
Contact: Not specified  

2. Accused Details:
Describe all persons involved clearly

3. Date and Time of Incident:
(Extract or mark as Not specified)

4. Place of Occurrence:
(Be as specific as possible)

5. Brief Description of Incident:
(Write as a clear paragraph in chronological order)

6. Observations:
(Bullet points of key facts)

----------------------------------------

CHRONOLOGICAL TIMELINE:

- Step 1: ...
- Step 2: ...
- Step 3: ...

----------------------------------------

UNCERTAINTIES / MISSING INFORMATION:

- List clearly

----------------------------------------

INPUT TESTIMONY:
{user_input}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text.strip()