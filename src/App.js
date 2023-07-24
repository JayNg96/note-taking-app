import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
// import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"
import './style.css'

export default function App() {

    const [notes, setNotes] = React.useState(() => JSON.parse(localStorage.getItem("notes")) || [])

    React.useEffect(()=>{
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes])

    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )

    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    function updateNote(text) {

        setNotes(oldNotes => {
            let newArray = []
            for(let i = 0; i < oldNotes.length; i++){
                console.log(oldNotes[i])
                if(oldNotes[i].id === currentNoteId){
                    newArray.unshift({...oldNotes[i], body: text})
                }
                else {
                    newArray.push(oldNotes[i])
                }
            }
            return newArray
        })
    }
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
        
    }

    function deleteNote(event, noteId){
        event.stopPropagation()
        setNotes(prevNotes => prevNotes.filter(prevNote => prevNote.id !== noteId))
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
