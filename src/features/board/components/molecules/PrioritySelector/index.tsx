import { Button, Input } from "@/components/ui/atoms";
import { PrioritySelectorProps } from "./types";
import { usePrioritySelector } from "./usePrioritySelector";

export function PrioritySelector({
  priorities,
  selected,
  onChange,
  onUpdatePriorities,
}: PrioritySelectorProps) {
  const { 
    PRESET_COLORS,
    sorted, 
    isEditing, 
    setIsEditing, 
    newLabel, 
    setNewLabel, 
    newColor, 
    setNewColor, 
    handleAdd, 
    handleDelete, 
    handleMoveUp, 
    handleMoveDown, 
    handleRenameStart, 
    handleRenameCommit, 
    editingId, 
    editingLabel, 
    setEditingLabel } = usePrioritySelector({ priorities, selected, onChange, onUpdatePriorities });

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onChange(null)}
          className={[
            "px-2.5 py-0.5 rounded text-xs font-medium transition-all",
            selected === null
              ? "bg-zinc-600 text-zinc-100"
              : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300",
          ].join(" ")}
        >
          None
        </button>

        {sorted.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            className="px-2.5 py-0.5 rounded text-xs font-medium transition-all border"
            style={
              selected === p.id
                ? {
                    backgroundColor: p.color + "33",
                    color: p.color,
                    borderColor: p.color,
                  }
                : {
                    backgroundColor: "transparent",
                    color: "#71717a",
                    borderColor: "transparent",
                  }
            }
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
              style={{ backgroundColor: p.color }}
            />
            {p.label}
          </button>
        ))}
      </div>

      {onUpdatePriorities && (
        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing((v) => !v)}
            className="text-zinc-600 hover:text-zinc-400 !px-0 text-xs"
          >
            {isEditing ? "▲ Done" : "✎ Manage priorities"}
          </Button>

          {isEditing && (
            <div className="mt-2 bg-zinc-800/60 border border-zinc-700 rounded-lg p-3 space-y-2">
              {sorted.map((p, index) => (
                <div key={p.id} className="flex items-center gap-2 group">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: p.color }}
                  />

                  {editingId === p.id ? (
                    <Input
                      autoFocus
                      value={editingLabel}
                      onChange={(e) => setEditingLabel(e.target.value)}
                      onBlur={handleRenameCommit}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleRenameCommit()
                      }
                      className="flex-1 !bg-zinc-700 !text-zinc-100 !border-zinc-500 text-xs !py-0.5 !px-2"
                    />
                  ) : (
                    <span
                      className="flex-1 text-xs text-zinc-300 cursor-pointer hover:text-white"
                      onDoubleClick={() => handleRenameStart(p)}
                      title="Double-click to rename"
                    >
                      {p.label}
                    </span>
                  )}

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="!px-1 !py-0 text-zinc-500 hover:text-zinc-200 text-xs"
                      title="Move up"
                    >
                      ↑
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === sorted.length - 1}
                      className="!px-1 !py-0 text-zinc-500 hover:text-zinc-200 text-xs"
                      title="Move down"
                    >
                      ↓
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRenameStart(p)}
                      className="!px-1 !py-0 text-zinc-500 hover:text-blue-400 text-xs"
                      title="Rename"
                    >
                      ✎
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(p.id)}
                      className="!px-1 !py-0 text-xs !bg-transparent hover:!bg-transparent text-zinc-500 hover:text-red-400"
                      title="Delete"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-2 pt-2 border-t border-zinc-700">
                <div className="flex gap-1">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewColor(c)}
                      className={[
                        "w-4 h-4 rounded-full transition-transform",
                        newColor === c
                          ? "scale-125 ring-1 ring-white ring-offset-1 ring-offset-zinc-900"
                          : "",
                      ].join(" ")}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <Input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  placeholder="New label…"
                  className="flex-1 !bg-zinc-700 !text-zinc-200 !border-transparent focus:!border-zinc-500 text-xs !py-1"
                />

                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleAdd}
                  disabled={!newLabel.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}