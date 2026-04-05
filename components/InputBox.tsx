"use client";

type InputBoxProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function InputBox({ value, onChange }: InputBoxProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter testimony..."
      rows={8}
      className="w-full rounded-2xl border border-purple-400 bg-[#e9d3ff] p-4 text-xl text-purple-950 placeholder:text-purple-500 focus:outline-none"
    />
  );
}
