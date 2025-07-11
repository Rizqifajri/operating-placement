import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs } from "firebase/firestore"
import { NextResponse } from "next/server"

// GET: Ambil semua data dari koleksi "Project"
export async function GET() {
  try {
    const ref = collection(db, "Project")
    const snapshot = await getDocs(ref)
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error("GET error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST: Tambah data baru ke koleksi "Project"
export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Optional: validasi dasar
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "Payload is empty or invalid." },
        { status: 400 }
      )
    }

    const docRef = await addDoc(collection(db, "Project"), body)
    return NextResponse.json({ id: docRef.id }, { status: 201 })
  } catch (error: any) {
    console.error("POST error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
