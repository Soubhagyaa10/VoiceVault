"use client";

import { useEffect, useRef, useState } from "react";
import InputBox from "@/components/InputBox";
import OutputBox from "@/components/OutputBox";
import Button from "@/components/Button";
import { saveFIR } from "@/lib/database";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function Home() {
  const [status, setStatus] = useState("Passive");

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [testimony, setTestimony] = useState("");
  const [fir, setFir] = useState("");

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const [aiMessage, setAiMessage] = useState(
    "💜 I'm here with you. You can take your time.",
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!testimony) {
      setAiMessage("💜 I'm here with you. You can take your time.");
    } else if (testimony.length < 50) {
      setAiMessage(
        "You're doing great. Share as much as you're comfortable with.",
      );
    } else if (testimony.length < 120) {
      setAiMessage("🤝 I’m listening carefully. You’re not alone in this.");
    } else {
      setAiMessage("🫶 Thank you for trusting this space. Your voice matters.");
    }
  }, [testimony]);

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser. Please use Chrome.",
      );
      return false;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setTestimony(transcript.trim());
    };

    recognition.onerror = () => {
      console.error("Speech recognition error");
    };

    recognitionRef.current = recognition;
    recognition.start();
    return true;
  };

  const stopSpeechRecognition = () => {
    try {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    } catch (error) {
      console.error("Stop speech recognition error:", error);
    }
  };

  const handleRecord = async () => {
    try {
      if (!isRecording) {
        const ok = startSpeechRecognition();
        if (!ok) return;

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaStreamRef.current = stream;

        const recorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const file = new File([blob], "recorded-audio.webm", {
            type: "audio/webm",
          });
          setAudioFile(file);

          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = null;
          }

          audioChunksRef.current = [];
          mediaRecorderRef.current = null;
        };

        mediaRecorderRef.current = recorder;
        recorder.start();
        setIsRecording(true);
      } else {
        mediaRecorderRef.current?.stop();
        stopSpeechRecognition();
        setIsRecording(false);
      }
    } catch (error) {
      console.error("Microphone access error:", error);
      alert("Please allow microphone access.");
    }
  };

  const generateFIR = async () => {
    try {
      let mediaInfo = "None";

      if (audioFile || videoFile) {
        mediaInfo = [
          audioFile ? `Audio Uploaded: ${audioFile.name}` : "",
          videoFile ? `Video Uploaded: ${videoFile.name}` : "",
        ]
          .filter(Boolean)
          .join("\n");
      }

      const dummy = `
FIR REPORT

Name: ${name || "N/A"}
Contact: ${contact || "N/A"}

Statement:
${testimony || "N/A"}

Date & Time:
${new Date().toLocaleString()}:

Location:
Patiala

Media:
${mediaInfo}

Status: 🟡 Passive
      `.trim();

      setFir(dummy);

      await saveFIR({
        name,
        contact,
        testimony,
        fir: dummy,
        createdAt: new Date().toISOString(),
        audioFileName: audioFile?.name || "",
        videoFileName: videoFile?.name || "",
      });
    } catch (error) {
      console.error("Error generating/saving FIR:", error);
    }
  };

  const clearAll = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    stopSpeechRecognition();

    setName("");
    setContact("");
    setTestimony("");
    setFir("");
    setAudioFile(null);
    setVideoFile(null);
    setIsRecording(false);
    setStatus("Passive");
    setAiMessage("💜 I'm here with you. You can take your time.");
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#efe4ff] px-6">
        <div className="w-full max-w-md rounded-3xl border border-purple-200 bg-[#e3ccff] p-8 shadow-lg">
          <h2
            className="mb-4 text-center text-4xl font-bold text-purple-700
          00"
          >
            Welcome to VoiceVault
          </h2>

          <div className="mb-6 space-y-3 text-center text-lg text-purple-700">
            <p className="text-2xl font-semibold text-fuchsia-700">
              🌸 You are safe here. You are not alone.
            </p>

            <p>Take your time.</p>
            <p className="font-medium text-violet-700">
              💜 Your voice matters.
            </p>
          </div>

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className="mb-3 w-full rounded-xl border border-purple-300 bg-white p-3 text-purple-950 placeholder:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="OTP"
            className="mb-4 w-full rounded-xl border border-purple-300 bg-white p-3 text-purple-950 placeholder:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            onClick={() => {
              if (otp === "1234" && phone.trim().length >= 10) {
                setIsLoggedIn(true);
              } else {
                alert("Enter valid phone number or OTP");
              }
            }}
            className="w-full rounded-xl bg-purple-700 px-4 py-3 font-medium text-purple transition hover:bg-purple-600"
          >
            Verify & Continue
          </button>

          <p className="mt-3 text-center text-sm text-purple-700">
            Demo OTP: 1234
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#efe4ff] px-6 py-10 text-purple-950">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-6xl font-bold tracking-tight text-purple-700">
            VoiceVault
          </h1>
          <p className="mt-4 text-base text-purple-700">
            FIR support with voice, audio, and video input in one place.
          </p>
        </div>

        <section className="rounded-[28px] border border-purple-200 bg-[#dcb8ff] p-8 shadow-md">
          <div className="space-y-5">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full rounded-2xl border border-purple-400 bg-[#e9d3ff] p-4 text-xl text-purple-800 placeholder:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Contact"
              className="w-full rounded-2xl border border-purple-400 bg-[#e9d3ff] p-4 text-xl text-purple-800 placeholder:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <div className="rounded-2xl border border-purple-400 bg-[#e9d3ff] p-2">
              <InputBox value={testimony} onChange={setTestimony} />
            </div>

            <div className="rounded-2xl border border-purple-400 bg-[#f3e8ff] p-4 shadow-sm">
              <p className="mb-1 text-sm font-medium text-purple-700">
                🤖 Support Assistant
              </p>
              <p className="text-base leading-relaxed text-purple-800">
                {aiMessage}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={handleRecord}
                className={`rounded-2xl px-6 py-3 text-lg font-medium transition ${
                  isRecording
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-purple-700 text-white hover:bg-purple-700"
                }`}
              >
                {isRecording ? "⏹ Stop Recording" : "🎙 Record"}
              </button>

              <input
                type="file"
                accept="audio/*"
                id="audioUpload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setAudioFile(file);
                }}
              />

              <label
                htmlFor="audioUpload"
                className="cursor-pointer rounded-2xl bg-purple-600 px-6 py-3 text-lg font-medium text-white transition hover:bg-purple-600"
              >
                🎧 Upload Audio
              </label>

              <input
                type="file"
                accept="video/mp4,png,jpeg,video/*"
                id="videoUpload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setVideoFile(file);
                }}
              />

              <label
                htmlFor="videoUpload"
                className="cursor-pointer rounded-2xl bg-purple-600 px-6 py-3 text-lg font-medium text-white transition hover:bg-purple-700"
              >
                Evidence
              </label>

              <Button onClick={generateFIR}>Generate FIR</Button>

              <button
                onClick={clearAll}
                className="rounded-2xl border border-purple-500 bg-transparent px-6 py-3 text-lg font-medium text-purple-900 transition hover:bg-purple-100"
              >
                Clear
              </button>
            </div>

            <div className="space-y-2">
              {isRecording && (
                <p className="text-sm font-medium text-red-700">
                  Recording and transcribing...
                </p>
              )}

              {audioFile && (
                <p className="text-sm font-medium text-purple-800">
                  Audio selected: {audioFile.name}
                </p>
              )}

              {videoFile && (
                <p className="text-sm font-medium text-purple-800">
                  Video selected: {videoFile.name}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-purple-200 bg-[#dcb8ff] p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-purple-900">
            Generated FIR
          </h2>

          <div className="rounded-2xl border border-purple-400 bg-[#e9d3ff] p-2">
            <OutputBox text={fir} audioFile={audioFile} videoFile={videoFile} />
          </div>

          {fir && (
            <p className="mt-4 text-base font-semibold text-purple-600">
              Status: 🟡 Passive
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
