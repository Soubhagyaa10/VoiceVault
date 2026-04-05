import { ref, push } from "firebase/database";
import { db } from "./firebase";

export type FIRData = {
  name: string;
  contact: string;
  testimony: string;
  fir: string;
  createdAt: string;
  audioFileName?: string;
  videoFileName?: string;
};

export async function saveFIR(data: FIRData) {
  try {
    const firsRef = ref(db, "firs");
    const newFirRef = await push(firsRef, data);
    return newFirRef.key;
  } catch (error) {
    console.error("Error saving FIR:", error);
    throw error;
  }
}
