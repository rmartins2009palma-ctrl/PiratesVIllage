"use client"

import { useState } from "react"
import { Lock, EllipsisVertical, Send, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { type StaffNote, formatDate } from "@/lib/mock-data"

function authorInitials(author: string): string {
  const parts = author.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ""
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ""
  return `${first}${last}`.toUpperCase()
}

/** Mock timestamps are "YYYY-MM-DD HH:MM". */
function formatStamp(timestamp: string): string {
  const [date, time] = timestamp.split(" ")
  if (!time) return timestamp
  return `${formatDate(date)} · ${time}`
}

function NoteCard({ note, onDelete }: { note: StaffNote; onDelete: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <Avatar className="size-9 shrink-0 border-2 border-accent/30">
          <AvatarFallback className="bg-secondary text-xs font-semibold text-primary">
            {authorInitials(note.author)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight text-foreground">{note.author}</p>
          <p className="font-mono text-xs tabular-nums text-muted-foreground">
            {formatStamp(note.timestamp)}
          </p>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={`Actions for the note by ${note.author}`}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <EllipsisVertical className="size-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-9 z-10 w-44 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  onDelete(note.id)
                }}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/8"
              >
                <Trash2 className="size-4 shrink-0" />
                Delete note
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-foreground">{note.text}</p>
    </article>
  )
}

export function TabNotes({
  notes,
  onAdd,
  onDelete,
}: {
  notes: StaffNote[]
  onAdd: (text: string) => void
  onDelete: (id: string) => void
}) {
  const [draft, setDraft] = useState("")
  const canPost = draft.trim().length > 0

  const handlePost = () => {
    if (!canPost) return
    onAdd(draft.trim())
    setDraft("")
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Composer */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <label htmlFor="new-staff-note" className="sr-only">
          Add an observation
        </label>
        <Textarea
          id="new-staff-note"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add an observation..."
          rows={3}
          className="min-h-24 resize-y bg-secondary/30"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Lock className="size-3.5 shrink-0" />
            Notes are private to the animation team.
          </p>
          <Button
            onClick={handlePost}
            disabled={!canPost}
            className="bg-accent font-semibold text-accent-foreground hover:brightness-105"
          >
            <Send data-icon="inline-start" />
            Post note
          </Button>
        </div>
      </div>

      {/* Existing notes */}
      {notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-serif text-lg font-semibold text-foreground">No notes yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Log the first observation so the rest of the crew is in the loop.
          </p>
        </div>
      ) : (
        notes.map((note) => <NoteCard key={note.id} note={note} onDelete={onDelete} />)
      )}
    </div>
  )
}
