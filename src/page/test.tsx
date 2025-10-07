import { useState } from "react"

export default function TestPage(){
    const [notes, setNotes] = useState([])
    
    return (
        <div className="flex items-center justify-center w-full min-h-screen jus">
            <div>
                <h1 className="text-xl font-semibold">{text}</h1>
                <div className="flex items-center gap-2">
                    <input onChange={(e) => setText(e.target.value)} type="text" className="p-3 border border-gray-200" />
                    <button className="p-3 font-semibold text-white bg-indigo-600">TAMBAH</button>
                </div>
            </div>
        </div>
    )
}