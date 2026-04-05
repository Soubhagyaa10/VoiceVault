import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, contact, testimony } = await req.json();

    const comfortMessage = `Thank you for sharing this. I'm sorry you had to go through something distressing. You did the right thing by documenting the incident, and your statement has been organized below in a clear format.`;

    const firText = `
FIR REPORT

Complainant Name:
${name || "Not provided"}

Contact Details:
${contact || "Not provided"}

Complainant Statement:
${testimony || "No input given"}

Incident Type:
Not provided

Location:
Not provided

Date:
Not provided

Accused:
Not provided

Summary:
Based on the provided testimony, a complaint draft has been generated in a structured format for further review.

Status:
Draft Generated Successfully
    `.trim();

    return NextResponse.json({
      comfortMessage,
      firText,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
