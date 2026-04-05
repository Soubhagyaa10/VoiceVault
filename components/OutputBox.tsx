"use client";

type OutputBoxProps = {
  text: string;
  audioFile?: File | null;
  videoFile?: File | null;
};

export default function OutputBox({
  text,
  audioFile,
  videoFile,
}: OutputBoxProps) {
  return (
    <div className="space-y-4">
      <pre className="whitespace-pre-wrap rounded-2xl border border-purple-400 bg-[#e9d3ff] p-4 text-lg text-purple-950">
        {text || "No FIR generated yet."}
      </pre>

      {audioFile && (
        <div className="rounded-2xl border border-purple-400 bg-[#e9d3ff] p-4">
          <p className="mb-2 text-sm text-purple500">Uploaded Audio Preview</p>
          <audio controls className="w-full">
            <source src={URL.createObjectURL(audioFile)} />
            Your browser does not support audio preview.
          </audio>
        </div>
      )}

      {videoFile && (
        <div className="rounded-2xl border border-purple-400 bg-[#e9d3ff] p-4">
          <p className="mb-2 text-sm text-purple-600">Uploaded Video Preview</p>
          <video controls className="w-full rounded-xl">
            <source src={URL.createObjectURL(videoFile)} />
            Your browser does not support video preview.
          </video>
        </div>
      )}
    </div>
  );
}
